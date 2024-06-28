import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {

  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
    .then(result => {
      if(result.data.Status) { 
        localStorage.removeItem("valid")
        navigate('/')
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="flex-shrink-0 px-4 py-5 flex items-center justify-center bg-gray-900">
            <Link to="/dashboard" className="text-2xl font-semibold">AND</Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            <ul>
              <li>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/student" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Manage Student</Link>
              </li>
              <li>
                <Link to="/dashboard/interview" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Schedule Interview</Link>
              </li>
              <li>
                <Link to="/dashboard/company" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Company</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
