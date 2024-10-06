from flask import Flask, render_template, jsonify, request
import math

app = Flask(__name__)

# Bacteria data with updated growth rates and filtration efficiency
BACTERIA_TYPES = {
    'E.coli': {
        'name': 'Escherichia coli',
        'initial_count': 100,
        'growth_rate': math.log(2) / 0.3333,  # per hour (doubling every ~20 minutes)
        'threshold': 1e6,  # Upper threshold
        'filtration_efficiency': 0.99  # High efficiency to nearly eradicate bacteria
    },
    'L.pneumophila': {
        'name': 'Legionella pneumophila',
        'initial_count': 50,
        'growth_rate': math.log(2) / 7,  # per hour (doubling every 7 hours)
        'threshold': 1e4,  # Upper threshold
        'filtration_efficiency': 0.99
    },
    'S.aureus': {
        'name': 'Staphylococcus aureus',
        'initial_count': 80,
        'growth_rate': math.log(2) / 0.5,  # per hour (doubling every 30 minutes)
        'threshold': 1e5,  # Upper threshold
        'filtration_efficiency': 0.99
    }
}

# Aerosol concentration parameters
AEROSOL_PARAMS = {
    'E': 100,    # Exhalation rate (particles per minute)
    'V': 1000,   # Volume of confined space (m³)
    'kv': 0.1,   # Ventilation rate (1/hour)
    'ks': 0.05,  # Settling rate of droplets (1/hour)
    'kd': 0.02   # Decay rate of virus in aerosols (1/hour)
}

# Calculate decay rate lambda
AEROSOL_PARAMS['lambda'] = AEROSOL_PARAMS['kv'] + AEROSOL_PARAMS['ks'] + AEROSOL_PARAMS['kd']

# Global simulation data
simulation_data = {
    'bacteria_type': 'E.coli',
    'bacteria_count': BACTERIA_TYPES['E.coli']['initial_count'],
    'aerosol_concentration': 0,  # C(t) in particles per m³
    'time_step': 0,
    'filtration_active': False,
    'data_points': []
}

@app.route('/')
def index():
    return render_template('index.html', bacteria_types=BACTERIA_TYPES)

@app.route('/simulate', methods=['POST'])
def simulate():
    global simulation_data
    data = request.get_json()
    action = data.get('action')

    if action == 'start':
        # Reset simulation data
        bacteria_type = data.get('bacteria_type', 'E.coli')
        simulation_data = {
            'bacteria_type': bacteria_type,
            'bacteria_count': BACTERIA_TYPES[bacteria_type]['initial_count'],
            'aerosol_concentration': 0,  # Starting with no aerosols
            'time_step': 0,
            'filtration_active': False,
            'data_points': []
        }
        return jsonify({'status': 'Simulation started'})

    elif action == 'step':
        bacteria_info = BACTERIA_TYPES[simulation_data['bacteria_type']]
        simulation_data['time_step'] += 1  # Assuming each time_step is 1 hour

        # Calculate lower threshold as 1% of upper threshold
        upper_threshold = bacteria_info['threshold']
        lower_threshold = 0.01 * upper_threshold  # 1% of upper threshold

        # Get previous bacteria count
        N_prev = simulation_data['bacteria_count']

        # Determine if filtration should be active or not
        if not simulation_data['filtration_active'] and N_prev >= upper_threshold:
            simulation_data['filtration_active'] = True
        elif simulation_data['filtration_active'] and N_prev <= lower_threshold:
            simulation_data['filtration_active'] = False

        if simulation_data['filtration_active']:
            # Filtration is active: Reduce bacteria count significantly
            filtration_efficiency = bacteria_info['filtration_efficiency']
            Nt = N_prev * (1 - filtration_efficiency)
            bacteria_reduced = N_prev - Nt
            simulation_data['bacteria_count'] = Nt

            # Reduce aerosol concentration
            Ct = simulation_data['aerosol_concentration']
            Ct_filtered = Ct * (1 - filtration_efficiency)
            simulation_data['aerosol_concentration'] = Ct_filtered
        else:
            # Filtration is inactive: Bacteria grow normally
            r = bacteria_info['growth_rate']
            Nt = N_prev * math.exp(r * 1)  # t = 1 hour
            simulation_data['bacteria_count'] = Nt
            bacteria_reduced = 0

            # Update Aerosol Concentration C(t) using dC/dt = E/V - lambda * C
            E = AEROSOL_PARAMS['E']
            V = AEROSOL_PARAMS['V']
            lambda_decay = AEROSOL_PARAMS['lambda']
            Ct = simulation_data['aerosol_concentration']
            delta_t = 1  # 1 hour

            dCdt = (E / V) - (lambda_decay * Ct)
            Ct_new = Ct + dCdt * delta_t
            simulation_data['aerosol_concentration'] = max(Ct_new, 0)  # Prevent negative concentration

        # Record data point
        data_point = {
            'time': simulation_data['time_step'],
            'bacteria_count': simulation_data['bacteria_count'],
            'aerosol_concentration': simulation_data['aerosol_concentration'],
            'filtration_active': simulation_data['filtration_active'],
            'bacteria_reduced': bacteria_reduced
        }
        simulation_data['data_points'].append(data_point)

        return jsonify(data_point)

    elif action == 'reset':
        # Reset simulation data
        bacteria_type = simulation_data['bacteria_type']
        simulation_data = {
            'bacteria_type': bacteria_type,
            'bacteria_count': BACTERIA_TYPES[bacteria_type]['initial_count'],
            'aerosol_concentration': 0,  # Reset aerosol concentration
            'time_step': 0,
            'filtration_active': False,
            'data_points': []
        }
        return jsonify({'status': 'Simulation reset'})

    else:
        return jsonify({'error': 'Invalid action'}), 400

if __name__ == '__main__':
    app.run(debug=True)
