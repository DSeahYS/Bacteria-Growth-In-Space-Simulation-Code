// static/js/scripts.js

// Function to fetch and render Business Projections
fetch('/api/business-projections')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
            return;
        }
        renderRevenueProjectionsChart(data);
        renderMarketShareChart(data);
        populateRevenueTable(data);
    })
    .catch(error => {
        console.error('Error fetching business projections:', error);
        alert('Failed to load business projections data.');
    });

// Function to render Revenue Projections Chart
function renderRevenueProjectionsChart(data) {
    const ctx = document.getElementById('revenueProjectionsChart').getContext('2d');
    const systemSalesEarth = data.system_sales_earth;
    const systemSalesSpace = data.system_sales_space;
    const maintenanceContractsEarth = data.maintenance_contracts_earth;
    const maintenanceContractsSpace = data.maintenance_contracts_space;
    const dataAnalyticsEarth = data.data_analytics_earth;
    const dataAnalyticsSpace = data.data_analytics_space;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.years,
            datasets: [
                {
                    label: 'System Sales (Earth) ($)',
                    data: systemSalesEarth,
                    backgroundColor: '#3F51B5'
                },
                {
                    label: 'System Sales (Space) ($)',
                    data: systemSalesSpace,
                    backgroundColor: '#2196F3'
                },
                {
                    label: 'Maintenance Contracts (Earth) ($)',
                    data: maintenanceContractsEarth,
                    backgroundColor: '#4CAF50'
                },
                {
                    label: 'Maintenance Contracts (Space) ($)',
                    data: maintenanceContractsSpace,
                    backgroundColor: '#8BC34A'
                },
                {
                    label: 'Data Analytics (Earth) ($)',
                    data: dataAnalyticsEarth,
                    backgroundColor: '#FF9800'
                },
                {
                    label: 'Data Analytics (Space) ($)',
                    data: dataAnalyticsSpace,
                    backgroundColor: '#FFC107'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Projected Revenue Streams (2024-2033)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                }
            }
        }
    });
}

// Function to render Market Share Chart
function renderMarketShareChart(data) {
    const ctx = document.getElementById('marketShareOverTimeChart').getContext('2d');
    const marketShare = data.laparis_share_percent.map(value => parseFloat(value).toFixed(4));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'LAPARIS Market Share (%)',
                data: marketShare,
                borderColor: '#E91E63',
                backgroundColor: 'rgba(233, 30, 99, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'LAPARIS Market Share Over Time (2024-2033)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20, // Adjust based on max expected market share
                    title: {
                        display: true,
                        text: 'Market Share (%)'
                    },
                    ticks: {
                        stepSize: 2,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

// Function to populate the Revenue Details Table
function populateRevenueTable(data) {
    const tableBody = document.getElementById('revenue-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    data.years.forEach((year, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${year}</td>
            <td>${data.earth_units_sold[index]}</td>
            <td>${data.space_units_sold[index]}</td>
            <td>$${data.system_sales_earth[index].toLocaleString()}</td>
            <td>$${data.system_sales_space[index].toLocaleString()}</td>
            <td>$${data.maintenance_contracts_earth[index].toLocaleString()}</td>
            <td>$${data.maintenance_contracts_space[index].toLocaleString()}</td>
            <td>$${data.data_analytics_earth[index].toLocaleString()}</td>
            <td>$${data.data_analytics_space[index].toLocaleString()}</td>
            <td>$${data.total_revenue[index].toLocaleString()}</td>
            <td>$${(data.global_market_size[index] / 1e9).toFixed(2)}B</td>
            <td>${data.laparis_share_percent[index]}%</td>
        `;
        tableBody.appendChild(row);
    });
}
