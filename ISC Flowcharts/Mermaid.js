#Mermaid.js
<!-- CFD Aerosol Experiment -->
<section id="cfd-experiment">
    <h2>CFD Aerosol Experiment</h2>
    <div class="mermaid">
        graph LR
        Start(Start) --> DefineGeometry["Define Enclosed Space Geometry<br/><span title='Setting up the physical dimensions of the enclosed area'>"]
        DefineGeometry --> SetParameters["Set CFD Model Parameters<br/><span title='Configure airflow, turbulence, and other simulation parameters'>"]
        SetParameters --> SimulateBreathing["Simulate Breathing as Aerosol Source<br/><span title='Model the emission of aerosols at 12 breaths per minute'>"]
        SimulateBreathing --> RunSimulation["Run CFD Simulation<br/><span title='Execute the simulation to track aerosol dispersion'>"]
        RunSimulation --> AnalyzeResults["Analyze Aerosol Dispersion Patterns<br/><span title='Evaluate how aerosols spread and accumulate'>"]
        AnalyzeResults --> IdentifyZones["Identify High-Risk Zones<br/><span title='Determine areas with high aerosol concentration'>"]
        IdentifyZones --> End(End)
    </div>
</section>

<!-- Clinostat Experiment -->
<section id="clinostat-experiment">
    <h2>Clinostat Experiment</h2>
    <div class="mermaid">
        graph TB
        Start(Start) --> PrepareCultures["Prepare E. coli Cultures<br/><span title='Inoculate LB broth with E. coli K12'>"]
        PrepareCultures --> SetupClinostat["Set Up Clinostat<br/><span title='Construct and calibrate the clinostat to simulate microgravity'>"]
        SetupClinostat --> PlaceCultures["Place Cultures on Clinostat<br/><span title='Transfer cultures into the clinostat\'s environment'>"]
        PlaceCultures --> IncubateCultures["Incubate Cultures<br/><span title='Maintain incubation conditions at 37°C with rotation'>"]
        IncubateCultures --> MonitorGrowth["Monitor Bacterial Growth<br/><span title='Measure OD600, biofilm formation, and cell morphology at intervals'>"]
        MonitorGrowth --> CompareResults["Compare Microgravity and Control Groups<br/><span title='Assess differences in growth patterns and biofilm formation'>"]
        CompareResults --> DetermineGrowth["Determine Growth Rate<br/><span title='Calculate exponential growth rates from data'>"]
        DetermineGrowth --> End(End)
    </div>
</section>

<!-- Space Experiment with AI-Driven Filtration -->
<section id="space-experiment">
    <h2>Space Experiment with AI-Driven Filtration</h2>
    <div class="mermaid">
        graph TD
            Start(Start) --> SimulateMG["Simulate Microgravity Conditions<br/><span title='Utilize data from Earth-based experiments to mimic space conditions'>"]
            SimulateMG --> DeploySensors["Deploy Sensors<br/><span title='Install sensors to monitor bacterial presence and aerosol levels'>"]
            DeploySensors --> CollectData["Collect Environmental Data<br/><span title='Gather real-time data from sensors'>"]
            CollectData --> AIAnalyze["AI Analyzes Data<br/><span title='AI processes sensor data to assess infection risk'>"]
            AIAnalyze --> Decision{Aerosol Concentration<br/>Above Threshold?<br/><span title='Determine if action is required based on AI analysis'>}
            Decision -- Yes --> ActivateFiltration["Activate Filtration System<br/><span title='Engage HEPA filters and UV-C irradiation to reduce aerosol concentration'>"]
            Decision -- No --> ContinueMonitor["Continue Monitoring<br/><span title='Maintain regular surveillance without activating filtration'>"]
            ActivateFiltration --> VerifyReduction["Verify Aerosol Reduction<br/><span title='Ensure filtration has effectively reduced aerosol levels'>"]
            VerifyReduction --> End(End)
            ContinueMonitor --> CollectData
    </div>
</section>

