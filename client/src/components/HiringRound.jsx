import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FilteredStudents = () => {
    const { companyName } = useParams();
    const [columns, setColumns] = useState([]);
    const [studentsByColumn, setStudentsByColumn] = useState({});
    const [showStudents, setShowStudents] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.post('http://localhost:3000/auth/get_columns', { companyName })
            .then(response => {
                if (response.data.Status) {
                    setColumns(response.data.Columns);
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => {
                setError(err.message);
            });
    }, [companyName]);

    const fetchStudents = (roundName) => {
        if (!showStudents[roundName]) {
            axios.post('http://localhost:3000/auth/get_students_by_column', { companyName, roundName })
                .then(response => {
                    if (response.data.Status) {
                        setStudentsByColumn(prevState => ({
                            ...prevState,
                            [roundName]: response.data.Students
                        }));
                        setShowStudents(prevState => ({
                            ...prevState,
                            [roundName]: true
                        }));
                    } else {
                        setError(response.data.Error);
                    }
                })
                .catch(err => {
                    setError(err.message);
                });
        } else {
            setShowStudents(prevState => ({
                ...prevState,
                [roundName]: false
            }));
        }
    };

    const finishDrive = () => {
        axios.post('http://localhost:3000/auth/finish_drive', { companyName })
            .then(response => {
                if (response.data.Status) {
                    console.log('Drive finished successfully');
                } else {
                    setError(response.data.Error);
                }
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-between space-x-4">
                <div>
                    <Link to={`/dashboard/interview/${companyName}/first_round`}
                          className="mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-block">
                        Add First Round
                    </Link>
                    <Link to={`/dashboard/interview/${companyName}/add_round`}
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-block">
                        Add Round
                    </Link>
                </div>
                <div>
                    <button onClick={finishDrive}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded inline-block">
                        Finish Drive
                    </button>
                </div>
            </div>
            {error && <div className="text-red-500 mb-4">Error: {error}</div>}
            {columns.map((roundName) => (
                <div key={roundName} className="border rounded shadow mb-4">
                    <button onClick={() => fetchStudents(roundName)}
                            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex justify-between items-center">
                        <span className="text-xl font-semibold">{`${companyName}_${roundName}`}</span>
                        <span className="text-2xl">{showStudents[roundName] ? '-' : '+'}</span>
                    </button>
                    {showStudents[roundName] && (
                        <div className="p-4">
                            <div className="mb-4">
                                <span className="text-lg font-medium">Total Students: {studentsByColumn[roundName]?.length}</span>
                            </div>
                            {studentsByColumn[roundName]?.length > 0 ? (
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Name</th>
                                            <th className="py-2 px-4 border-b">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsByColumn[roundName].map((student, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b">{student.name}</td>
                                                <td className="py-2 px-4 border-b">{student.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No students found.</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FilteredStudents;
