import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Company = () => {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/company')
            .then(response => {
                if (response.data.Status) {
                    setCompanies(response.data.Companies);
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => setError(err.message));
    }, []);

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Companies List</h3>
                <Link to="/dashboard/add_company" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Add Company
                </Link>
            </div>
            {error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Eligible CGPA</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company.name} className="hover:bg-gray-100">
                                    <td className="px-4 py-2">{company.name}</td>
                                    <td className="px-4 py-2">
                                        {truncateDescription(company.description, 50)}
                                        {company.description.length > 50 && (
                                            <span className="text-blue-500 cursor-pointer ml-1">
                                                <Link to={`/company/${company.id}`}>Read more</Link>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{company.eligible_cgpa}</td>
                                    <td className="px-4 py-2">{company.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Company;
