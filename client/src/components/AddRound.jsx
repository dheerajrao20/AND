import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import SendEmails from './SendEmails';

const AddRound = () => {
    const { companyName } = useParams(); // Extract companyName from URL
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [roundName, setRoundName] = useState('');
    const [emailsSent, setEmailsSent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStudentsData([]);
        setEmailsSent(false);
    };

    const handleParseFile = () => {
        if (!file) {
            setStatus({ type: 'error', message: 'Please upload an Excel file.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const parsedData = jsonData.map(row => ({
                name: row.Name,
                email: row.Email
            }));

            setStudentsData(parsedData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRoundNameChange = (e) => {
        setRoundName(e.target.value);
    };

    const updateDatabase = () => {
        if (!roundName.trim()) {
            setStatus({ type: 'error', message: 'Please enter a round name.' });
            return;
        }

        if (!companyName) {
            setStatus({ type: 'error', message: 'Company name is missing.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('companyName', companyName);
        formData.append('roundName', roundName);

        axios.post('http://localhost:3000/auth/alter_student_table', formData)
            .then(response => {
                if (response.data.status === 'success') {
                    setStatus({ type: 'success', message: response.data.message });
                } else {
                    setStatus({ type: 'error', message: response.data.error });
                }
            })
            .catch(err => setStatus({ type: 'error', message: err.message }));
    };

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Add Round</h3>
            <form>
                <div className="mb-4">
                    <label htmlFor="roundName" className="block text-sm font-medium text-gray-700">Round Name:</label>
                    <input
                        type="text"
                        id="roundName"
                        name="roundName"
                        value={roundName}
                        onChange={handleRoundNameChange}
                        className="mt-1 py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Excel File:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="mt-1 py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="button" onClick={handleParseFile} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Parse File
                </button>
            </form>
            {status && (
                <div className={`mt-4 p-2 text-white ${status.type === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-md`}>
                    {status.message}
                </div>
            )}
            <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                {showEmailForm ? 'Hide Email Form' : 'Send Emails to Students'}
            </button>

            <button
                onClick={updateDatabase}
                className="ml-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                disabled={studentsData.length === 0}
            >
                Update Database
            </button>

            {showEmailForm && <SendEmails students={studentsData} />}

            {studentsData.length > 0 && !emailsSent && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Uploaded Student Data:</h4>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.map((student, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">{student.email}</td>
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

export default AddRound;
