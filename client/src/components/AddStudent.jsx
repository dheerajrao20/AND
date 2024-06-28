import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
    const [student, setStudent] = useState({
        reg: "",
        name: "",
        email: "",
        password: "",
        CGPA: "",
        branch: "",
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3000/auth/add_student', student, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => {
            if (result.data.Status) {
                navigate('/dashboard/student');
            } else {
                alert(result.data.Error);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold mb-4">Add Student</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="inputReg" className="block text-sm font-medium text-gray-700">Reg. No.</label>
                    <input
                        type="number"
                        id="inputReg"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Registeration No."
                        onChange={(e) => setStudent({ ...student, reg: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputName" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="inputName"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Name"
                        onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputEmail4" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="inputEmail4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Email"
                        autoComplete="off"
                        onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputPassword4" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="inputPassword4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Password"
                        onChange={(e) => setStudent({ ...student, password: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputCGPA" className="block text-sm font-medium text-gray-700">CGPA</label>
                    <input
                        type="text"
                        id="inputCGPA"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter CGPA"
                        autoComplete="off"
                        onChange={(e) => setStudent({ ...student, CGPA: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputbranch" className="block text-sm font-medium text-gray-700">Branch</label>
                    <input
                        type="text"
                        id="inputbranch"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter branch"
                        autoComplete="off"
                        onChange={(e) => setStudent({ ...student, branch: e.target.value })}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Student
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
