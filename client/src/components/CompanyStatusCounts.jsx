// CompanyStatusCounts.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const CompanyStatusCounts = () => {
    const [companyCounts, setCompanyCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/company_status_counts')
            .then(response => {
                if (response.data.Status) {
                    setCompanyCounts(response.data.CompanyStatusCounts);
                } else {
                    setError(response.data.Error);
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
        if (!loading && Object.keys(companyCounts).length > 0) {
            renderChart();
        }
    }, [companyCounts, loading]);

    const renderChart = () => {
        const ctx = document.getElementById('companyStatusChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Active Companies', 'Inactive Companies'],
                datasets: [{
                    label: 'Company Status',
                    data: [companyCounts.activeCount, companyCounts.inactiveCount],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0,
                    },
                },
            },
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Company Status Counts</h1>
            <canvas id="companyStatusChart" className="mb-4"></canvas>
            <div className="text-lg font-semibold">
                <p>Active Companies: {companyCounts.activeCount}</p>
                <p>Inactive Companies: {companyCounts.inactiveCount}</p>
            </div>
        </div>
    );
};

export default CompanyStatusCounts;
