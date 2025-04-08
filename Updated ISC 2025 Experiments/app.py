from flask import Flask, render_template, jsonify, request
import math

app = Flask(__name__)

# Define bacteria types with their properties
BACTERIA_TYPES = {
    'E.coli': {
        'name': 'Escherichia coli',
        'initial_count': 100,
        'growth_rate': math.log(2) / 0.3333,  # per hour (doubling every ~20 minutes)
        'threshold': 1e6,  # Upper threshold
        'uv_inactivation_rate': 6.907755  # per hour (~3 log reduction per hour)
    },
    'L.pneumophila': {
        'name': 'Legionella pneumophila',
        'initial_count': 50,
        'growth_rate': math.log(2) / 7.0,  # per hour (doubling every 7 hours)
        'threshold': 1e4,  # Upper threshold
        'uv_inactivation_rate': 4.60517  # per hour (~2 log reduction per hour)
    }
}

# Aerosol parameters based on room size and ventilation
AEROSOL_PARAMS = {
    'E': 600 * 60,    # Exhalation rate (particles per hour) [Converted from per minute]
    'V': 26.4,        # Volume in m³ (5 x 2.4 x 2.2 meters)
    'kv': 6.0,        # Ventilation rate (1/hour) - 6 ACH for confined spaces
    'ks': 0.01,       # Settling rate (1/hour)
    'kd': 0.02        # Decay rate (1/hour)
}
AEROSOL_PARAMS['lambda'] = AEROSOL_PARAMS['kv'] + AEROSOL_PARAMS['ks'] + AEROSOL_PARAMS['kd']  # Total decay rate

# Define the coverage factor for UV-C in vents (percentage of air treated)
UV_C_COVERAGE_FACTOR = 0.2  # 20% of the air passing through vents is treated

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
        simulation_data['time_step'] += 1  # Each time_step is 15 minutes (0.25 hours)

        # Calculate thresholds
        upper_threshold = bacteria_info['threshold']
        lower_threshold = 0.01 * upper_threshold  # 1% of upper threshold

        N_prev = simulation_data['bacteria_count']
        Ct_prev = simulation_data['aerosol_concentration']

        # Determine filtration status
        if not simulation_data['filtration_active'] and N_prev >= upper_threshold:
            simulation_data['filtration_active'] = True
        elif simulation_data['filtration_active'] and N_prev <= lower_threshold:
            simulation_data['filtration_active'] = False

        delta_t = 0.25  # time step in hours (15 minutes)

        if simulation_data['filtration_active']:
            # Filtration is active: UV disinfection
            k_uv = bacteria_info['uv_inactivation_rate']  # per hour
            # Effective UV inactivation rate accounting for coverage and dynamic efficiency
            eta = get_dynamic_filtration_efficiency(N_prev, upper_threshold)
            effective_k_uv = k_uv * eta * UV_C_COVERAGE_FACTOR  # Adjusted for coverage

            Nt = N_prev * math.exp(-effective_k_uv * delta_t)
            bacteria_reduced = N_prev - Nt
            simulation_data['bacteria_count'] = Nt

            # Reduce aerosol concentration accounting for both natural decay and UV
            lambda_decay = AEROSOL_PARAMS['lambda']
            Ct = Ct_prev

            # dC/dt = E/V - (lambda + effective_k_uv) * C
            dCdt = (AEROSOL_PARAMS['E'] / AEROSOL_PARAMS['V']) - (lambda_decay + effective_k_uv) * Ct
            Ct_new = Ct + dCdt * delta_t
            simulation_data['aerosol_concentration'] = max(Ct_new, 0)  # Prevent negative values
        else:
            # Filtration is inactive: Bacteria grow normally
            r = bacteria_info['growth_rate']  # per hour
            Nt = N_prev * math.exp(r * delta_t)
            simulation_data['bacteria_count'] = Nt
            bacteria_reduced = 0

            # Update Aerosol Concentration C(t) using dC/dt = E/V - lambda * C
            E = AEROSOL_PARAMS['E']
            V = AEROSOL_PARAMS['V']
            lambda_decay = AEROSOL_PARAMS['lambda']
            Ct = Ct_prev

            dCdt = (E / V) - (lambda_decay) * Ct
            Ct_new = Ct + dCdt * delta_t
            simulation_data['aerosol_concentration'] = max(Ct_new, 0)  # Prevent negative values

        # Record data point
        data_point = {
            'time': simulation_data['time_step'] * 0.25,  # Convert to hours
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

def get_dynamic_filtration_efficiency(current_count, upper_threshold):
    """
    Calculate dynamic filtration efficiency based on current pathogen concentration.
    For example, higher pathogen counts trigger higher filtration efficiency.
    This is a simple proportional model; more complex models can be implemented as needed.
    """
    # Define maximum and minimum efficiency
    max_efficiency = 1.0  # 100%
    min_efficiency = 0.5  # 50%

    # Scale efficiency between min and max based on pathogen count
    efficiency = min_efficiency + (max_efficiency - min_efficiency) * (current_count / upper_threshold)
    efficiency = min(efficiency, max_efficiency)  # Cap at max_efficiency
    efficiency = max(efficiency, min_efficiency)  # Floor at min_efficiency

    return efficiency

if __name__ == '__main__':
    app.run(debug=True)
