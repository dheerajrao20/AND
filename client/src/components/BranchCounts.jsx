// BranchCounts.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const BranchCounts = () => {
    const [branchCounts, setBranchCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/branch_counts')
            .then(response => {
                if (response.data.Status) {
                    setBranchCounts(response.data.BranchCounts);
                } else {
                    setError(response.data.Error || 'Unknown error occurred');
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Render the chart once data is loaded
        if (!loading && branchCounts.length > 0) {
            renderChart();
        }
    }, [branchCounts, loading]);

    const renderChart = () => {
        const labels = branchCounts.map(branch => branch.branch);
        const data = branchCounts.map(branch => branch.studentCount);

        const ctx = document.getElementById('branchCountsChart');
        new Chart(ctx, {
            type: 'bar', // Changed to bar chart
            data: {
                labels: labels,
                datasets: [{
                    label: 'Student Counts',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color for bars
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false, // Hide legend for bar chart
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
        });
    };

    if (loading) {
        return <div className="p-6 max-w-4xl mx-auto">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 max-w-4xl mx-auto text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Student Counts by Branch (Bar Chart)</h1>
            <canvas id="branchCountsChart" className="mb-4"></canvas>
            <div className="bg-white rounded-lg shadow-md p-4">
                {branchCounts.map(branch => (
                    <div key={branch.branch} className="mb-2">
                        <h2 className="text-lg font-semibold">{branch.branch}: {branch.studentCount}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BranchCounts;
