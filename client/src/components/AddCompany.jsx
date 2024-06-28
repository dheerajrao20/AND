import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCompany = () => {
    const navigate = useNavigate();

    const [company, setCompany] = useState({
        name: '',
        description: '',
        eligible_cgpa: '',
        status: 'active' // Default status
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/add_company', company)
            .then(response => {
                if (response.data.Status) {
                    console.log('Company added successfully');
                    navigate('/dashboard/company');
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => setError(err.message));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md">
                <h3 className="text-2xl font-semibold text-center bg-gray-100 py-4">Add Company</h3>
                <form onSubmit={handleSubmit} className="px-8 py-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={company.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={company.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="eligible_cgpa" className="block text-sm font-medium text-gray-700">Eligible CGPA:</label>
                        <input
                            type="text"
                            id="eligible_cgpa"
                            name="eligible_cgpa"
                            value={company.eligible_cgpa}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={company.status}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Add Company
                        </button>
                    </div>
                </form>
                {error && <div className="text-red-500 text-center py-2">Error: {error}</div>}
            </div>
        </div>
    );
};

export default AddCompany;
