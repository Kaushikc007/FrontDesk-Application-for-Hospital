import Link from 'next/link'
import Image from 'next/image'
import { Users, Calendar, Clock, UserCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="bg-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Image 
                    src="/allo-health-logo.svg" 
                    alt="Allo Health" 
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Allo Health Clinic</h1>
                <p className="text-gray-300">Front Desk Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Welcome to the Front Desk System
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage patient queues, appointments, and doctor schedules efficiently. 
            Get started by selecting one of the options below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard" className="group">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-900/50 rounded-lg mb-4">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Dashboard</h3>
              <p className="text-gray-300">
                View overall clinic status and quick actions
              </p>
            </div>
          </Link>

          <Link href="/queue" className="group">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-900/50 rounded-lg mb-4">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Queue Management</h3>
              <p className="text-gray-300">
                Manage patient queue and update status
              </p>
            </div>
          </Link>

          <Link href="/appointments" className="group">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-900/50 rounded-lg mb-4">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Appointments</h3>
              <p className="text-gray-300">
                Book, reschedule, and manage appointments
              </p>
            </div>
          </Link>

          <Link href="/doctors" className="group">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-900/50 rounded-lg mb-4">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Doctors</h3>
              <p className="text-gray-300">
                Manage doctor profiles and schedules
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
