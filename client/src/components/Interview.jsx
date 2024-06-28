import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Interview = () => {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/active_companies')
            .then(response => {
                if (response.data.Status) {
                    setCompanies(response.data.Companies);
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h3 className="text-2xl font-semibold mb-6">Active Companies</h3>
            {error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map(company => (
                        <div key={company.name} className="bg-white rounded-lg overflow-hidden shadow-md">
                            <div className="p-4">
                                <h4 className="text-lg font-semibold mb-2">{company.name}</h4>
                                <p className="text-gray-600 mb-4">{company.description}</p>
                                <Link
                                    to={`/dashboard/interview/${company.name}`}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Interview;
