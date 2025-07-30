'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, Clock, UserCheck, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { appointmentService, Appointment } from '@/services/appointment.service'
import { doctorService, Doctor } from '@/services/doctor.service'
import { patientService } from '@/services/patient.service'

interface DashboardStats {
  totalPatientsToday: number
  appointmentsToday: number
  patientsInQueue: number
  activeDoctors: number
  completedAppointments: number
  pendingAppointments: number
}

interface RecentActivity {
  id: number
  type: 'appointment' | 'queue' | 'completion' | 'reschedule'
  message: string
  time: string
  patientName?: string
  doctorName?: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatientsToday: 0,
    appointmentsToday: 0,
    patientsInQueue: 0,
    activeDoctors: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch all data in parallel
      const [
        todayAppointments,
        allDoctors,
        allPatients
      ] = await Promise.all([
        appointmentService.getTodaysAppointments(),
        doctorService.getDoctors(),
        patientService.getPatients()
      ])

      // Calculate stats from real data
      const activeDoctors = allDoctors.filter((doctor: Doctor) => doctor.status === 'active').length
      const completedAppointments = todayAppointments.filter((apt: Appointment) => apt.status === 'completed').length
      const pendingAppointments = todayAppointments.filter((apt: Appointment) => apt.status === 'scheduled').length

      setStats({
        totalPatientsToday: allPatients.length,
        appointmentsToday: todayAppointments.length,
        patientsInQueue: 0, // This would come from queue service when implemented
        activeDoctors: activeDoctors,
        completedAppointments: completedAppointments,
        pendingAppointments: pendingAppointments,
      })

      // Create recent activity from real appointments
      const recentActivities: RecentActivity[] = todayAppointments
        .slice(0, 5)
        .map((appointment: Appointment, index: number) => ({
          id: appointment.id,
          type: appointment.status === 'completed' ? 'completion' : 'appointment',
          message: `${appointment.status === 'completed' ? 'Completed' : 'Scheduled'} appointment: ${appointment.patient?.firstName} ${appointment.patient?.lastName} with ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`,
          time: `${index * 3 + 2} minutes ago`,
          patientName: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
          doctorName: `${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
        }))

      setRecentActivity(recentActivities)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-300 mt-1">Welcome back! Here&apos;s what&apos;s happening at the clinic today.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Patients Today</dt>
                    <dd className="text-2xl font-bold text-white">{stats.totalPatientsToday}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-900/30 px-6 py-3">
              <div className="text-sm">
                <Link href="/queue" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  View queue →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Appointments Today</dt>
                    <dd className="text-2xl font-bold text-white">{stats.appointmentsToday}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 px-6 py-3">
              <div className="text-sm">
                <Link href="/appointments" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  View appointments →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">In Queue</dt>
                    <dd className="text-2xl font-bold text-white">{stats.patientsInQueue}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/30 px-6 py-3">
              <div className="text-sm">
                <Link href="/queue" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
                  Manage queue →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Active Doctors</dt>
                    <dd className="text-2xl font-bold text-white">{stats.activeDoctors}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-green-900/30 px-6 py-3">
              <div className="text-sm">
                <Link href="/doctors" className="font-medium text-green-400 hover:text-green-300 transition-colors">
                  View doctors →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Status */}
          <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/40 to-purple-800/40">
              <h3 className="text-lg font-semibold text-purple-300">Today&apos;s Appointments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Completed</span>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-white mr-3">{stats.completedAppointments}</span>
                    <div className="w-32 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${(stats.completedAppointments / stats.appointmentsToday) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Pending</span>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-white mr-3">{stats.pendingAppointments}</span>
                    <div className="w-32 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${(stats.pendingAppointments / stats.appointmentsToday) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/40 to-purple-800/40">
              <h3 className="text-lg font-semibold text-purple-300">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'appointment' ? 'bg-blue-900/50 text-blue-400' :
                        activity.type === 'queue' ? 'bg-orange-900/50 text-orange-400' : 'bg-green-900/50 text-green-400'
                      }`}>
                        {activity.type === 'appointment' && <Calendar className="w-5 h-5" />}
                        {activity.type === 'queue' && <Clock className="w-5 h-5" />}
                        {activity.type === 'completion' && <UserCheck className="w-5 h-5" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">{activity.message}</p>
                      <p className="text-xs text-purple-400 font-medium mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/40 to-purple-800/40">
              <h3 className="text-lg font-semibold text-purple-300">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/queue"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Add to Queue
                </Link>
                <Link 
                  href="/appointments"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Link>
                <Link 
                  href="/doctors"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Manage Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
