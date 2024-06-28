import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
// import '../css/custom.css'

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const [error, setError] = useState(null)

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
            if(result.data.loginStatus) {
                localStorage.setItem("valid", true)
                navigate('/dashboard')
            } else {
                setError(result.data.Error)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 custom-bg">
            <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden w-3/4 max-w-4xl">
                <div className="w-1/2 p-10">
                    <h2 className="text-3xl font-bold mb-4 text-indigo-700">Hello!</h2>
                    <p className="mb-4">Sign in to your account</p>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold">Email:</label>
                            <div className="flex items-center bg-white rounded-lg shadow-lg p-2 mt-1">
                                <span className="inline-block px-3"><svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.94 4.94a1.5 1.5 0 00-.439 2.182l.057.071L9 12.584l6.441-5.386a1.5 1.5 0 00-.877-2.54l-.093-.007H3.5a1.5 1.5 0 00-1.56 1.29zM1 12.5V14a1 1 0 001 1h16a1 1 0 001-1v-1.5a1 1 0 00-.13-.494l-8 6.668a1.5 1.5 0 01-1.872 0l-8-6.668A1 1 0 001 12.5z"/></svg></span>
                                <input type="email" name="email" id="email" placeholder="Enter Email" className="w-full bg-transparent focus:outline-none" onChange={(e) => setValues({ ...values, email: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold">Password:</label>
                            <div className="flex items-center bg-white rounded-lg shadow-lg p-2 mt-1">
                                <span className="inline-block px-3"><svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9a3 3 0 116 0v1h2V9a5 5 0 00-10 0v1h2V9zM2 14a1 1 0 011-1h14a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z" clipRule="evenodd"/></svg></span>
                                <input type="password" name="password" id="password" placeholder="Enter Password" className="w-full bg-transparent focus:outline-none" onChange={(e) => setValues({ ...values, password: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">Sign In</button>
                    </form>
                </div>
                <div className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 p-10 text-white flex flex-col items-center justify-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p>Access your dashboard, manage your profile, and explore our features by signing in.</p>
                </div>
            </div>
        </div>
    )
}

export default Login
