// static/js/scripts.js

// Smooth Scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Sticky Navigation
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (window.pageYOffset > 100) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// Market Growth Chart
fetch('/api/market-analysis')
    .then(response => response.json())
    .then(data => {
        var ctxMarket = document.getElementById('marketGrowthChart').getContext('2d');
        var marketGrowthChart = new Chart(ctxMarket, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Global Air Purifier Market Size ($ Billion)',
                    data: data.market_size,
                    borderColor: '#00796B',
                    backgroundColor: 'rgba(0, 121, 107, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Global Air Purifier Market Size Projection (2020-2030)'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y + 'B';
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: '$ Billion'
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
    });

// Competitive Analysis Chart
fetch('/api/market-share')
    .then(response => response.json())
    .then(data => {
        var ctxCompetitive = document.getElementById('competitiveAnalysisChart').getContext('2d');
        var competitiveAnalysisChart = new Chart(ctxCompetitive, {
            type: 'radar',
            data: {
                labels: ['AI-Driven Adaptability', 'Real-Time Pathogen Detection', 'Energy Optimization', 'Scalability', 'Data Analytics', 'HEPA Filtration', 'UV-C Irradiation'],
                datasets: [
                    {
                        label: 'LAPARIS',
                        data: [5, 5, 5, 5, 5, 5, 5],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: '#4CAF50',
                        pointBackgroundColor: '#4CAF50',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4CAF50'
                    },
                    {
                        label: 'Honeywell',
                        data: [3, 1, 4, 3, 3, 5, 1],
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        borderColor: '#FFC107',
                        pointBackgroundColor: '#FFC107',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#FFC107'
                    },
                    {
                        label: 'Daikin',
                        data: [3, 1, 4, 4, 3, 5, 2],
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        borderColor: '#2196F3',
                        pointBackgroundColor: '#2196F3',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#2196F3'
                    },
                    {
                        label: 'Blueair',
                        data: [2, 1, 3, 2, 2, 5, 1],
                        backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        borderColor: '#9C27B0',
                        pointBackgroundColor: '#9C27B0',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#9C27B0'
                    },
                    {
                        label: 'IQAir',
                        data: [3, 2, 3, 4, 4, 5, 2],
                        backgroundColor: 'rgba(0, 188, 212, 0.2)',
                        borderColor: '#00BCD4',
                        pointBackgroundColor: '#00BCD4',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#00BCD4'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Competitive Feature Analysis'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    });

// Revenue Projections Chart
fetch('/api/business-projections')
    .then(response => response.json())
    .then(data => {
        var ctxRevenue = document.getElementById('revenueProjectionsChart').getContext('2d');
        var revenueProjectionsChart = new Chart(ctxRevenue, {
            type: 'bar',
            data: {
                labels: data.years,
                datasets: [
                    {
                        label: 'System Sales ($ Million)',
                        data: data.system_sales,
                        backgroundColor: '#3F51B5'
                    },
                    {
                        label: 'Maintenance Contracts ($ Million)',
                        data: data.maintenance_contracts,
                        backgroundColor: '#8BC34A'
                    },
                    {
                        label: 'Data Analytics ($ Million)',
                        data: data.data_analytics,
                        backgroundColor: '#FF9800'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Projected Revenue Streams (2024-2033) in $ Million'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y + 'M';
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Revenue ($ Million)'
                        }
                    }
                }
            }
        });
    });

// Market Share Over Time Chart
fetch('/api/market-share')
    .then(response => response.json())
    .then(data => {
        var ctxMarketShare = document.getElementById('marketShareOverTimeChart').getContext('2d');
        var marketShareOverTimeChart = new Chart(ctxMarketShare, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'LAPARIS Market Share (%)',
                        data: data.laparis_share,
                        borderColor: '#E91E63',
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Total Market Size ($ Billion)',
                        data: data.total_market,
                        borderColor: '#9E9E9E',
                        backgroundColor: 'rgba(158, 158, 158, 0.1)',
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Market Share Over Time (2024-2033)'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'LAPARIS Market Share (%)') {
                                    return context.dataset.label + ': ' + context.parsed.y + '%';
                                } else {
                                    return context.dataset.label + ': $' + context.parsed.y + 'B';
                                }
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Market Share (%)'
                        },
                        min: 0,
                        max: 2,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Total Market Size ($ Billion)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 10,
                        max: 30
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
    });
