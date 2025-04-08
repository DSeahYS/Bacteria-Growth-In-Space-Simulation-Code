// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('header').classList.toggle('dark-mode');
        document.querySelectorAll('section').forEach(section => {
            section.classList.toggle('dark-mode');
        });
        document.querySelector('footer').classList.toggle('dark-mode');
        document.querySelector('.navbar').classList.toggle('dark-mode');
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.classList.toggle('dark-mode');
        });

        // Toggle Icon
        const icon = themeToggle.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Clickable Flowchart Nodes
    // Wait for Mermaid to render the flowcharts
    setTimeout(() => {
        const mermaidNodes = document.querySelectorAll('.mermaid svg g[class^="node"]');
        mermaidNodes.forEach(node => {
            node.style.cursor = 'pointer'; // Change cursor to pointer to indicate interactivity
            node.addEventListener('click', () => {
                const nodeId = node.getAttribute('id');
                const nodeTextElement = node.querySelector('text');
                let nodeText = "";
                if (nodeTextElement) {
                    nodeText = nodeTextElement.textContent.trim();
                } else {
                    nodeText = nodeId;
                }

                let infoText = "";
                let infoTitle = "";

                // Define detailed information based on node name
                switch(nodeText) {
                    // CFD Aerosol Experiment Nodes
                    case "Start":
                        infoTitle = "CFD Aerosol Experiment - Start";
                        infoText = "This marks the beginning of the CFD Aerosol Experiment.";
                        break;
                    case "Define Enclosed Space Geometry":
                        infoTitle = "Define Enclosed Space Geometry";
                        infoText = "Setting up the physical dimensions and layout of the enclosed space where the aerosol dispersion will be studied.";
                        break;
                    case "Set CFD Model Parameters":
                        infoTitle = "Set CFD Model Parameters";
                        infoText = "Configuring parameters such as airflow rates, turbulence models, and boundary conditions for the CFD simulation.";
                        break;
                    case "Simulate Breathing as Aerosol Source":
                        infoTitle = "Simulate Breathing as Aerosol Source";
                        infoText = "Modeling the emission of aerosols based on a breathing rate of 12 breaths per minute to simulate real-life aerosol dispersion.";
                        break;
                    case "Run CFD Simulation":
                        infoTitle = "Run CFD Simulation";
                        infoText = "Executing the CFD simulation to track and analyze aerosol movement within the enclosed space.";
                        break;
                    case "Analyze Aerosol Dispersion Patterns":
                        infoTitle = "Analyze Aerosol Dispersion Patterns";
                        infoText = "Evaluating the spread and accumulation of aerosols to identify areas with high concentration and potential risks.";
                        break;
                    case "Identify High-Risk Zones":
                        infoTitle = "Identify High-Risk Zones";
                        infoText = "Determining specific areas within the enclosed space where aerosol concentrations exceed safe thresholds.";
                        break;
                    case "End":
                        infoTitle = "CFD Aerosol Experiment - End";
                        infoText = "Conclusion of the CFD Aerosol Experiment.";
                        break;

                    // Clinostat Experiment Nodes
                    case "Prepare E. coli Cultures":
                        infoTitle = "Prepare E. coli Cultures";
                        infoText = "Inoculating LB broth with E. coli K12 to prepare for incubation under simulated microgravity conditions.";
                        break;
                    case "Set Up Clinostat":
                        infoTitle = "Set Up Clinostat";
                        infoText = "Constructing and calibrating the clinostat device to simulate microgravity by rotating the samples continuously.";
                        break;
                    case "Place Cultures on Clinostat":
                        infoTitle = "Place Cultures on Clinostat";
                        infoText = "Transferring the prepared E. coli cultures into the clinostat's environment for incubation.";
                        break;
                    case "Incubate Cultures":
                        infoTitle = "Incubate Cultures";
                        infoText = "Maintaining incubation conditions at 37°C with continuous rotation to simulate microgravity effects.";
                        break;
                    case "Monitor Bacterial Growth":
                        infoTitle = "Monitor Bacterial Growth";
                        infoText = "Measuring parameters such as OD600, biofilm formation, and cell morphology at specified intervals to assess bacterial behavior.";
                        break;
                    case "Compare Microgravity and Control Groups":
                        infoTitle = "Compare Microgravity and Control Groups";
                        infoText = "Analyzing differences in growth patterns and biofilm formation between cultures incubated under simulated microgravity and normal gravity conditions.";
                        break;
                    case "Determine Growth Rate":
                        infoTitle = "Determine Growth Rate";
                        infoText = "Calculating exponential growth rates based on collected data to understand the impact of microgravity on bacterial proliferation.";
                        break;

                    // Space Experiment with AI-Driven Filtration Nodes
                    case "Collect Pathogens using ESP":
                        infoTitle = "Collect Pathogens using ESP";
                        infoText = "Using Electrostatic Precipitator (ESP) to capture airborne pathogens from the environment.";
                        break;
                    case "Identify Pathogens using DIP Biosensor":
                        infoTitle = "Identify Pathogens using DIP Biosensor";
                        infoText = "Employing Digital Photocorrosion (DIP) Biosensor for selective detection of Legionella pneumophila.";
                        break;
                    case "AI Processes Data":
                        infoTitle = "AI Processes Data";
                        infoText = "AI algorithms analyze sensor data to assess infection risk and pathogen levels.";
                        break;
                    case "Aerosol Concentration Above Threshold?":
                        infoTitle = "Decision Point: Aerosol Concentration Above Threshold?";
                        infoText = "Determining whether the current aerosol concentration exceeds predefined safety thresholds.";
                        break;
                    case "Activate Filtration System":
                        infoTitle = "Activate Filtration System";
                        infoText = "Engaging HEPA filters and UV-C irradiation systems to reduce aerosol concentrations.";
                        break;
                    case "Continue Monitoring":
                        infoTitle = "Continue Monitoring";
                        infoText = "Maintaining regular surveillance of aerosol levels without activating filtration.";
                        break;
                    case "Filter Operation":
                        infoTitle = "Filter Operation";
                        infoText = "Operating HEPA filters and UV-C systems to effectively reduce airborne pathogen concentrations.";
                        break;
                    case "Check if Threshold Met":
                        infoTitle = "Check if Threshold Met";
                        infoText = "Assessing whether the filtration has sufficiently reduced aerosol concentrations below the threshold.";
                        break;

                    default:
                        infoTitle = nodeText;
                        infoText = "Detailed information is not available for this node.";
                }

                // Update modal content
                document.getElementById('modalContent').innerHTML = `<h4>${infoTitle}</h4><p>${infoText}</p>`;
                document.getElementById('infoModalLabel').innerText = nodeText.replace('\n', ' ');

                // Show the modal
                var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
                infoModal.show();
            });
        });

        // Smooth Scrolling for Navigation Links
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                const headerOffset = 70;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            });
        });
    }, 1000); // Adjust delay if necessary
});
