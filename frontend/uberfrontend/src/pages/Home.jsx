import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const { user } = useContext(UserDataContext)
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Uber Clone</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user.fullname?.firstname} {user.fullname?.lastname}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Book a Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
