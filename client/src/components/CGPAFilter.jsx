import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import SendEmails
 from './SendEmails';

const CGPAFilter = () => {
    const [cgpa, setCgpa] = useState('');
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0); // State for total number of students
    const [error, setError] = useState(null);
    const [showEmailForm, setShowEmailForm] = useState(false);


    const handleFetchStudents = () => {
        axios.get(`http://localhost:3000/auth/student/CGPA/${cgpa}`)
            .then(response => {
                if (response.data.Status) {
                    setStudents(response.data.Students);
                    setTotalStudents(response.data.Students.length); // Set total number of students
                    setError(null); // Reset error state if successful
                } else {
                    setError(response.data.Error);
                    setStudents([]); // Clear students array on error
                    setTotalStudents(0); // Reset total count on error
                }
            })
            .catch(err => {
                setError(err.message);
                setStudents([]); // Clear students array on error
                setTotalStudents(0); // Reset total count on error
            });
    };

    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(students);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, `Students_Above_${cgpa}.xlsx`);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold mb-4">Student List by CGPA</h3>
            <div className="mb-4">
                <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700">CGPA:</label>
                <input
                    type="text"
                    id="cgpa"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <button
                    onClick={handleFetchStudents}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Fetch Students
                </button>
                {students.length > 0 && (
                    <>
                    <button
                        onClick={handleExportToExcel}
                        className="ml-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Export to Excel
                    </button>
                    <button
                        onClick={() => setShowEmailForm(!showEmailForm)}
                        className="ml-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        {showEmailForm ? 'Hide Email Form' : 'Send Emails to Students'}
                    </button>
                    </>
                )}
                {showEmailForm && <SendEmails students={students} />}
            </div>
            {error ? (
                <div className="text-red-500 mb-4">Error: {error}</div>
            ) : (
                <div>
                    {students.length > 0 && (
                        <p className="mb-4 font-semibold">Total Students: {totalStudents}</p>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Reg No.</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.reg} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border">{student.reg}</td>
                                        <td className="px-4 py-2 border">{student.name}</td>
                                        <td className="px-4 py-2 border">{student.email}</td>
                                        <td className="px-4 py-2 border">{student.CGPA}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CGPAFilter;
