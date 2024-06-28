import React from 'react'
import { Link } from 'react-router-dom'
// import './custom.css'

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 custom-bg">
      <div className="text-center">
        <Link to="/adminlogin" className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Admin Login
        </Link>
      </div>
    </div>
  )
}

export default Start
