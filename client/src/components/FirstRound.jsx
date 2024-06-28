import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SendEmails from './SendEmails';
import * as XLSX from 'xlsx';

const FirstRound = () => {
    const { companyName } = useParams();
    const [cgpa, setCgpa] = useState('');
    const [branch, setBranch] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const handleFilter = () => {
        axios.post('http://localhost:3000/auth/filter_students', { cgpa, branch })
            .then(response => {
                if (response.data.Status) {
                    setStudents(response.data.Students);
                } else {
                    setError(response.data.Error);
                    setStudents([]); // Clear students array on error
                }
            })
            .catch(err => {
                setError(err.message);
                setStudents([]); // Clear students array on error
            });
    };

    const exportToExcel = () => {
        // Create a deep copy of students and remove 'password' field
        const studentsWithoutPassword = students.map(({ password, ...rest }) => rest);

        const worksheet = XLSX.utils.json_to_sheet(studentsWithoutPassword);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, `${companyName}_students.xlsx`);
    };

    const updateDatabase = () => {
        axios.post('http://localhost:3000/auth/update_students', { companyName, cgpa, branch })
            .then(response => {
                if (response.data.Status) {
                    alert('Database updated successfully.');
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-lg mx-auto bg-white rounded-md overflow-hidden shadow-md relative">
                <h3 className="text-2xl font-semibold text-center bg-gray-100 py-4">Round 1 Students for {companyName}</h3>
                <div className="px-6 py-4">
                    <div className="mb-4">
                        <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700">Required CGPA:</label>
                        <input
                            type="number"
                            id="cgpa"
                            name="cgpa"
                            value={cgpa}
                            onChange={(e) => setCgpa(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter required CGPA"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Required Branch:</label>
                        <input
                            type="text"
                            id="branch"
                            name="branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter required branch"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Filter Students
                    </button>

                    {error && <div className="text-red-500 mt-2">Error: {error}</div>}
                </div>
                <div className="px-6 py-4">
                    <h4 className="text-lg font-semibold mb-4">Eligible Students</h4>
                    {students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200">Name</th>
                                        <th className="py-2 px-4 border-b border-gray-200">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">No eligible students found.</p>
                    )}
                    {students.length > 0 && (
                        <>
                            <button
                                onClick={() => setShowEmailForm(!showEmailForm)}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {showEmailForm ? 'Hide Email Form' : 'Send Emails to Students'}
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="ml-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                disabled={students.length === 0}
                            >
                                Export to Excel
                            </button>
                            <button
                                onClick={updateDatabase}
                                className="ml-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                disabled={students.length === 0}
                            >
                                Update Database
                            </button>
                        </>
                    )}
                    {showEmailForm && <SendEmails students={students} />}
                </div>
            </div>
        </div>
    );
};

export default FirstRound;
