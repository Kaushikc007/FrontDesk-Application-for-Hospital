'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { appointmentService, Appointment } from '@/services/appointment.service'
import { doctorService, Doctor } from '@/services/doctor.service'
import { queueService } from '@/services/queue.service'
import { usePatients } from '@/contexts/PatientContext'
import PatientSelector from '@/components/PatientSelector'

const statusColors = {
  scheduled: 'bg-blue-900 text-blue-300 border border-blue-700',
  confirmed: 'bg-green-900 text-green-300 border border-green-700',
  in_progress: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
  completed: 'bg-gray-700 text-gray-300 border border-gray-600',
  cancelled: 'bg-red-900 text-red-300 border border-red-700',
  no_show: 'bg-orange-900 text-orange-300 border border-orange-700',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const {} = usePatients() // PatientSelector component uses this context
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    reasonForVisit: '',
    notes: '',
    addToQueue: true
  })

  // Load appointments and related data
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const appointmentsData = await appointmentService.getAppointments({
        startDate: selectedDate,
        endDate: selectedDate
      })
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Failed to load appointments:', error)
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    loadAppointments()
    loadDoctors()
  }, [loadAppointments])

  const loadDoctors = async () => {
    try {
      const doctorsData = await doctorService.getDoctors()
      setDoctors(doctorsData)
    } catch (error) {
      console.error('Failed to load doctors:', error)
    }
  }

  const updateAppointmentStatus = async (id: number, newStatus: Appointment['status']) => {
    try {
      await appointmentService.updateStatus(id, newStatus)
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ))
    } catch (error) {
      console.error('Failed to update appointment status:', error)
      setError('Failed to update appointment status')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newAppointment = await appointmentService.createAppointment({
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        duration: formData.duration,
        reasonForVisit: formData.reasonForVisit,
        notes: formData.notes
      })

      // Add the new appointment to the list
      setAppointments(prev => [...prev, newAppointment])

      // If checked, also add patient to queue
      if (formData.addToQueue) {
        await queueService.addToQueue({
          patientId: parseInt(formData.patientId),
          priority: 'normal'
        })
      }

      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create appointment:', error)
      setError('Failed to create appointment')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 30,
      reasonForVisit: '',
      notes: '',
      addToQueue: true
    })
  }

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setShowEditModal(true)
  }

  // Note: handleEditSubmit function was removed as it's not currently used
  // Add back when edit functionality is implemented

  const filteredAppointments = appointments.filter(apt => apt.appointmentDate === selectedDate)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Appointments</h1>
              <p className="text-gray-300">Book, reschedule, and manage appointments</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="bg-gray-800 shadow rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">
              Appointments for {format(new Date(selectedDate), 'MMMM dd, yyyy')}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {filteredAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No appointments scheduled for this date</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="px-6 py-4 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-white">
                            {appointment.appointmentTime}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                            {appointment.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium">Patient:</span> {appointment.patient.firstName} {appointment.patient.lastName}
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium">Doctor:</span> {appointment.doctor.firstName} {appointment.doctor.lastName} - {appointment.doctor.specialization}
                        </p>
                        {appointment.reasonForVisit && (
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                          </p>
                        )}
                        <p className="text-sm text-gray-400">
                          Duration: {appointment.duration} minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-200 bg-green-800 hover:bg-green-700 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-200 bg-blue-800 hover:bg-blue-700 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditClick(appointment)}
                        className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-200 bg-red-800 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-600 w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Book New Appointment</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Patient</label>
                  <PatientSelector
                    value={formData.patientId}
                    onChange={(patientId) => setFormData({...formData, patientId: patientId.toString()})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Doctor</label>
                  <select 
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="" className="text-gray-400">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id} className="text-white">
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input 
                      type="date" 
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input 
                      type="time" 
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={30} className="text-white">30 minutes</option>
                    <option value={45} className="text-white">45 minutes</option>
                    <option value={60} className="text-white">60 minutes</option>
                    <option value={90} className="text-white">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Visit</label>
                  <textarea 
                    value={formData.reasonForVisit}
                    onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                    rows={3} 
                    placeholder="Enter reason for visit..."
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={formData.addToQueue}
                      onChange={(e) => setFormData({...formData, addToQueue: e.target.checked})}
                      className="rounded border-gray-600 bg-gray-700 text-purple-600 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-300">Add patient to queue</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-600 w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Edit Appointment</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // For now, just close the modal - you can add form handling later
                setShowEditModal(false);
                setEditingAppointment(null);
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Patient Name</label>
                  <input 
                    type="text" 
                    value={`${editingAppointment.patient.firstName} ${editingAppointment.patient.lastName}`}
                    readOnly
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Doctor</label>
                  <select 
                    defaultValue={editingAppointment.doctor.id}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id} className="text-white">
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input 
                      type="date" 
                      defaultValue={editingAppointment.appointmentDate}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input 
                      type="time" 
                      defaultValue={editingAppointment.appointmentTime}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                  <select 
                    defaultValue={editingAppointment.duration}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="30" className="text-white">30 minutes</option>
                    <option value="45" className="text-white">45 minutes</option>
                    <option value="60" className="text-white">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select 
                    defaultValue={editingAppointment.status}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="scheduled" className="text-white">Scheduled</option>
                    <option value="confirmed" className="text-white">Confirmed</option>
                    <option value="in_progress" className="text-white">In Progress</option>
                    <option value="completed" className="text-white">Completed</option>
                    <option value="cancelled" className="text-white">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Visit</label>
                  <textarea 
                    defaultValue={editingAppointment.reasonForVisit}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500" 
                    rows={3} 
                    placeholder="Enter reason for visit..."
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAppointment(null);
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
