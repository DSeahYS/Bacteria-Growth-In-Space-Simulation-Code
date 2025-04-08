let timeData = [];
let bacteriaData = [];
let growthRateData = [];
let aerosolData = [];
let filtrationStatusData = [];
let filtrationEfficiencyData = [];
let filtrationActive = false;
let bacteriaType = 'E.coli';
let upperThreshold = 1e6;  // Upper threshold
let lowerThreshold = 0.01 * upperThreshold;  // Lower threshold (1% of upper)
let totalFiltrationTime = 0;
let cumulativeReduction = 0;
let simulationInterval = null;
let isPaused = false;

let bacteriaChart, growthRateChart, aerosolChart;

// Initialize Charts
function initializeCharts() {
    const ctxBacteria = document.getElementById('bacteriaChart').getContext('2d');
    bacteriaChart = new Chart(ctxBacteria, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: [{
                label: 'Bacteria Count (N(t))',
                data: bacteriaData,
                borderColor: 'blue',
                fill: false,
                tension: 0.1,
                yAxisID: 'y-log'
            },
            {
                label: 'Filtration Efficiency (%)',
                data: filtrationEfficiencyData,
                borderColor: 'red',
                fill: false,
                tension: 0.1,
                yAxisID: 'y-linear'
            }]
        },
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: true
                },
                annotation: {
                    annotations: {}
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (hours)'
                    }
                },
                'y-log': {
                    type: 'logarithmic',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bacteria Count'
                    },
                    min: 10,
                    ticks: {
                        callback: function(value, index, values) {
                            return Number(value.toString());
                        }
                    }
                },
                'y-linear': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Filtration Efficiency (%)'
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    const ctxGrowth = document.getElementById('growthRateChart').getContext('2d');
    growthRateChart = new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: [{
                label: 'Growth Rate (r)',
                data: growthRateData,
                borderColor: 'green',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (hours)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Growth Rate'
                    }
                }
            }
        }
    });

    const ctxAerosol = document.getElementById('aerosolChart').getContext('2d');
    aerosolChart = new Chart(ctxAerosol, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: [{
                label: 'Aerosol Concentration (C(t))',
                data: aerosolData,
                borderColor: 'orange',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: true
                },
                annotation: {
                    annotations: {}
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (hours)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Aerosol Concentration (particles/m³)'
                    },
                    type: 'linear',
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return value;
                        }
                    }
                }
            }
        }
    });

    // Register the annotation plugin
    if (typeof ChartAnnotation !== 'undefined') {
        Chart.register(ChartAnnotation);
    }
}

// Update threshold lines on bacteria chart
function updateThresholdLines() {
    bacteriaChart.options.plugins.annotation.annotations = {
        upperThresholdLine: {
            type: 'line',
            yMin: upperThreshold,
            yMax: upperThreshold,
            borderColor: 'red',
            borderWidth: 2,
            label: {
                content: 'Upper Threshold',
                enabled: true,
                position: 'start'
            }
        },
        lowerThresholdLine: {
            type: 'line',
            yMin: lowerThreshold,
            yMax: lowerThreshold,
            borderColor: 'purple',
            borderWidth: 2,
            label: {
                content: 'Lower Threshold',
                enabled: true,
                position: 'start'
            }
        }
    };
    bacteriaChart.update();
}

// Start the simulation
document.getElementById('startButton').addEventListener('click', function() {
    if (simulationInterval) {
        // If simulation is paused, resume it
        if (isPaused) {
            simulationInterval = setInterval(updateSimulation, 500); // Faster interval for simulation
            isPaused = false;
            console.log('Simulation resumed');
            document.getElementById('pauseButton').innerText = 'Pause Simulation';
        }
        return;
    }

    bacteriaType = document.getElementById('bacteriaSelect').value;
    upperThreshold = getThresholdForBacteria(bacteriaType);
    lowerThreshold = 0.01 * upperThreshold;
    console.log('Starting simulation for:', bacteriaType, 'with upper threshold:', upperThreshold, 'and lower threshold:', lowerThreshold);

    fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', bacteria_type: bacteriaType })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Simulation started:', data);
        // Reset data arrays
        timeData = [];
        bacteriaData = [];
        growthRateData = [];
        aerosolData = [];
        filtrationStatusData = [];
        filtrationEfficiencyData = [];
        totalFiltrationTime = 0;
        cumulativeReduction = 0;

        // Update charts
        bacteriaChart.data.labels = timeData;
        bacteriaChart.data.datasets[0].data = bacteriaData;
        bacteriaChart.data.datasets[1].data = filtrationEfficiencyData;
        growthRateChart.data.labels = timeData;
        growthRateChart.data.datasets[0].data = growthRateData;
        aerosolChart.data.labels = timeData;
        aerosolChart.data.datasets[0].data = aerosolData;

        // Update threshold lines
        updateThresholdLines();

        // Reset filtration status display
        filtrationActive = false;
        document.getElementById('filtrationStatus').innerText = 'Filtration Status: Inactive';

        // Update bacteria info
        updateBacteriaInfo();

        // Clear data table
        updateDataTable();

        // Start simulation steps
        simulationInterval = setInterval(updateSimulation, 500); // Faster interval for simulation
    })
    .catch(error => {
        console.error('Error starting simulation:', error);
    });
});

// Pause the simulation
document.getElementById('pauseButton').addEventListener('click', function() {
    if (isPaused) {
        // Resume simulation
        simulationInterval = setInterval(updateSimulation, 500);
        isPaused = false;
        console.log('Simulation resumed');
        document.getElementById('pauseButton').innerText = 'Pause Simulation';
    } else if (simulationInterval) {
        // Pause simulation
        clearInterval(simulationInterval);
        simulationInterval = null;
        isPaused = true;
        console.log('Simulation paused');
        document.getElementById('pauseButton').innerText = 'Resume Simulation';
    }
});

// Reset the simulation
document.getElementById('resetButton').addEventListener('click', function() {
    fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Simulation reset:', data);
        // Reset data arrays
        timeData = [];
        bacteriaData = [];
        growthRateData = [];
        aerosolData = [];
        filtrationStatusData = [];
        filtrationEfficiencyData = [];
        totalFiltrationTime = 0;
        cumulativeReduction = 0;

        // Update charts
        bacteriaChart.data.labels = timeData;
        bacteriaChart.data.datasets[0].data = bacteriaData;
        bacteriaChart.data.datasets[1].data = filtrationEfficiencyData;
        growthRateChart.data.labels = timeData;
        growthRateChart.data.datasets[0].data = growthRateData;
        aerosolChart.data.labels = timeData;
        aerosolChart.data.datasets[0].data = aerosolData;

        bacteriaChart.update();
        growthRateChart.update();
        aerosolChart.update();

        // Reset filtration status display
        filtrationActive = false;
        document.getElementById('filtrationStatus').innerText = 'Filtration Status: Inactive';

        // Clear analysis tools
        document.getElementById('maxBacteria').innerText = 'Max Bacteria Count: N/A';
        document.getElementById('timeToThreshold').innerText = 'Time to Reach Upper Threshold: N/A';
        document.getElementById('totalFiltrationTime').innerText = 'Total Filtration Time: N/A';
        document.getElementById('cumulativeReduction').innerText = 'Cumulative Bacteria Reduction: N/A';

        // Clear data table
        updateDataTable();

        // Stop simulation if it's running
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }

        // Reset pause button text
        isPaused = false;
        document.getElementById('pauseButton').innerText = 'Pause Simulation';
    })
    .catch(error => {
        console.error('Error resetting simulation:', error);
    });
});

// Get threshold for selected bacteria
function getThresholdForBacteria(bacteriaType) {
    const thresholds = {
        'E.coli': 1e6,
        'L.pneumophila': 1e4
    };
    return thresholds[bacteriaType];
}

// Update the simulation
function updateSimulation() {
    fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'step' })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Simulation step data:', data);
        timeData.push(data.time);
        bacteriaData.push(data.bacteria_count);
        aerosolData.push(data.aerosol_concentration);
        filtrationStatusData.push(data.filtration_active ? 1 : 0);
        // Assume filtration efficiency is based on current bacteria count
        let currentEfficiency = getDynamicFiltrationEfficiency(data.bacteria_count);
        filtrationEfficiencyData.push(currentEfficiency * 100); // Convert to percentage

        // Calculate growth rate
        if (bacteriaData.length > 1) {
            const previousCount = bacteriaData[bacteriaData.length - 2];
            const currentCount = bacteriaData[bacteriaData.length - 1];
            const growthRate = (currentCount - previousCount) / previousCount;
            growthRateData.push(growthRate);
        } else {
            growthRateData.push(0);
        }

        // Update cumulative statistics
        if (data.filtration_active) {
            totalFiltrationTime += 0.25; // Each step is 0.25 hours (15 minutes)
            cumulativeReduction += data.bacteria_reduced || 0;
        }

        // Update charts
        bacteriaChart.update();
        growthRateChart.update();
        aerosolChart.update();

        // Update filtration status display
        document.getElementById('filtrationStatus').innerText = 'Filtration Status: ' + (data.filtration_active ? 'Active' : 'Inactive');

        // Update analysis tools
        updateAnalysisTools();

        // Update data table
        updateDataTable();
    })
    .catch(error => {
        console.error('Error during simulation step:', error);
    });
}

function updateAnalysisTools() {
    if (bacteriaData.length === 0) return;

    // Update max bacteria count
    const maxBacteria = Math.max(...bacteriaData);
    document.getElementById('maxBacteria').innerText = 'Max Bacteria Count: ' + maxBacteria.toFixed(2);

    // Time to reach upper threshold
    const upperThresholdTimeIndex = bacteriaData.findIndex(count => count >= upperThreshold);
    if (upperThresholdTimeIndex !== -1) {
        const upperThresholdTime = timeData[upperThresholdTimeIndex];
        document.getElementById('timeToThreshold').innerText = 'Time to Reach Upper Threshold: ' + upperThresholdTime.toFixed(2) + ' hours';
    } else {
        document.getElementById('timeToThreshold').innerText = 'Time to Reach Upper Threshold: Not reached';
    }

    // Total filtration time
    document.getElementById('totalFiltrationTime').innerText = 'Total Filtration Time: ' + totalFiltrationTime.toFixed(2) + ' hours';

    // Cumulative bacteria reduction
    document.getElementById('cumulativeReduction').innerText = 'Cumulative Bacteria Reduction: ' + cumulativeReduction.toFixed(2);
}

function updateDataTable() {
    const dataTableBody = document.querySelector('#dataTable tbody');
    dataTableBody.innerHTML = ''; // Clear existing rows

    for (let i = 0; i < timeData.length; i++) {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.innerText = timeData[i].toFixed(2);
        row.appendChild(timeCell);

        const countCell = document.createElement('td');
        countCell.innerText = bacteriaData[i].toFixed(2);
        row.appendChild(countCell);

        const aerosolCell = document.createElement('td');
        aerosolCell.innerText = aerosolData[i].toFixed(2);
        row.appendChild(aerosolCell);

        const filtrationCell = document.createElement('td');
        filtrationCell.innerText = filtrationStatusData[i] === 1 ? 'Yes' : 'No';
        row.appendChild(filtrationCell);

        const efficiencyCell = document.createElement('td');
        efficiencyCell.innerText = filtrationEfficiencyData[i] ? filtrationEfficiencyData[i].toFixed(2) + '%' : 'N/A';
        row.appendChild(efficiencyCell);

        dataTableBody.appendChild(row);
    }
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Time (hours),Bacteria Count (N(t)),Aerosol Concentration (C(t)),Filtration Active,Filtration Efficiency (%)\n";

    for (let i = 0; i < timeData.length; i++) {
        const filtrationStatus = filtrationStatusData[i] === 1 ? 'Yes' : 'No';
        const efficiency = filtrationEfficiencyData[i] ? filtrationEfficiencyData[i].toFixed(2) : 'N/A';
        csvContent += `${timeData[i].toFixed(2)},${bacteriaData[i].toFixed(2)},${aerosolData[i].toFixed(2)},${filtrationStatus},${efficiency}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'simulation_data.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}

// Add event listener to download button
document.getElementById('downloadDataButton').addEventListener('click', downloadCSV);

function updateBacteriaInfo() {
    const bacteriaInfo = {
        'E.coli': {
            image: 'ecoli.jpg',
            description: 'E. coli is a gram-negative, rod-shaped bacterium commonly found in the lower intestine.'
        },
        'L.pneumophila': {
            image: 'legionella.jpg',
            description: 'L. pneumophila is a pathogenic bacterium that causes Legionnaires\' disease.'
        }
    };
    const info = bacteriaInfo[bacteriaType];
    document.getElementById('bacteriaImage').src = '/static/images/' + info.image;
    document.getElementById('bacteriaDescription').innerText = info.description;
}

function getDynamicFiltrationEfficiency(current_count) {
    // Define maximum and minimum efficiency
    const max_efficiency = 1.0;  // 100%
    const min_efficiency = 0.5;  // 50%

    // Scale efficiency between min and max based on pathogen count
    let efficiency = min_efficiency + (max_efficiency - min_efficiency) * (current_count / upperThreshold);
    efficiency = Math.min(efficiency, max_efficiency);  // Cap at max_efficiency
    efficiency = Math.max(efficiency, min_efficiency);  // Floor at min_efficiency

    return efficiency;
}

// Initialize charts on page load
initializeCharts();
