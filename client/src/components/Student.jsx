import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Student = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/student')
            .then(response => {
                if (response.data.Status) {
                    setStudents(response.data.Students);
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <div className="flex justify-between mb-4">
                <Link to="/dashboard/add_student" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Add Student
                </Link>
                <div >
                    <Link to="/dashboard/student/branch" className="mx-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Filter by Branch
                    </Link>
                    <Link to="/dashboard/student/CGPA" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Filter by CGPA
                    </Link>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Student List</h3>
            {error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Reg No.</th>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">CGPA</th>
                                <th className="px-4 py-2 border">Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.reg} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border">{student.reg}</td>
                                    <td className="px-4 py-2 border">{student.name}</td>
                                    <td className="px-4 py-2 border">{student.email}</td>
                                    <td className="px-4 py-2 border">{student.CGPA}</td>
                                    <td className="px-4 py-2 border">{student.branch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Student;
