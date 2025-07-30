'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Search, MapPin, Stethoscope } from 'lucide-react'
import { doctorService, Doctor } from '@/services/doctor.service'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    gender: 'male' as 'male' | 'female' | 'other',
    location: ''
  })
  const [addFormData, setAddFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    gender: 'male' as 'male' | 'female' | 'other',
    location: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load doctors
  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      console.log('Loading doctors from API...')
      const doctorsData = await doctorService.getDoctors()
      console.log('Successfully loaded doctors:', doctorsData.length)
      setDoctors(doctorsData)
      setError('') // Clear any previous errors
    } catch (error) {
      console.error('Failed to load doctors:', error)
      setError('Failed to load doctors from server. Please check your connection and try again.')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const updateDoctorStatus = (id: number, newStatus: 'active' | 'on_leave' | 'break' | 'inactive') => {
    console.log(`updateDoctorStatus called with id=${id}, newStatus=${newStatus}`)
    
    try {
      // Find the doctor being updated
      const doctorToUpdate = doctors.find(d => d.id === id)
      if (!doctorToUpdate) {
        console.error(`Doctor with id ${id} not found`)
        return
      }
      
      console.log(`Current doctor status: ${doctorToUpdate.status}, updating to: ${newStatus}`)
      
      // Update local state immediately for better UX
      setDoctors(prevDoctors => {
        const updated = prevDoctors.map(doctor => 
          doctor.id === id ? { 
            ...doctor, 
            status: newStatus,
            isActive: newStatus === 'active' 
          } : doctor
        )
        console.log(`Updated doctors array, doctor ${id} now has status: ${updated.find(d => d.id === id)?.status}`)
        return updated
      })

      // Clear any previous errors
      setError('')
      setSuccessMessage(`Doctor ${doctorToUpdate.firstName} ${doctorToUpdate.lastName} status updated to ${getStatusLabel(newStatus)}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // TODO: Add API call when backend is ready
      // await doctorService.updateStatus(id, newStatus)
      
      console.log(`Successfully updated doctor ${id} status to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update doctor status:', error)
      setError('Failed to update doctor status')
    }
  }

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setEditFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      gender: doctor.gender,
      location: doctor.location
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return

    try {
      // Update local state immediately for better UX
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.id === editingDoctor.id 
            ? { 
                ...doctor, 
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                email: editFormData.email,
                phone: editFormData.phone,
                specialization: editFormData.specialization,
                gender: editFormData.gender as 'male' | 'female' | 'other',
                location: editFormData.location
              }
            : doctor
        )
      )

      setSuccessMessage(`Doctor ${editFormData.firstName} ${editFormData.lastName} updated successfully`)
      setShowEditModal(false)
      setEditingDoctor(null)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // TODO: Add API call when backend is ready
      // await doctorService.updateDoctor(editingDoctor.id, editFormData)
      
    } catch (error) {
      console.error('Failed to update doctor:', error)
      setError('Failed to update doctor. Please try again.')
    }
  }

  const resetAddForm = () => {
    setAddFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      gender: 'male',
      location: ''
    })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Create new doctor object with a temporary ID
      const newDoctor: Doctor = {
        id: Date.now(), // Temporary ID - in real app this would come from backend
        firstName: addFormData.firstName,
        lastName: addFormData.lastName,
        email: addFormData.email,
        phone: addFormData.phone,
        specialization: addFormData.specialization,
        gender: addFormData.gender,
        location: addFormData.location,
        availability: 'Available', // Default value
        isActive: true,
        status: 'active',
        createdAt: new Date().toISOString()
      }

      // Add to local state immediately for better UX
      setDoctors(prevDoctors => [...prevDoctors, newDoctor])

      setSuccessMessage(`Doctor ${addFormData.firstName} ${addFormData.lastName} added successfully`)
      setShowAddModal(false)
      resetAddForm()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // TODO: Add API call when backend is ready
      // await doctorService.createDoctor(addFormData)
      
    } catch (error) {
      console.error('Failed to add doctor:', error)
      setError('Failed to add doctor. Please try again.')
    }
  }

  const getStatusColor = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300 border border-green-700'
      case 'on_leave':
        return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
      case 'break':
        return 'bg-blue-900 text-blue-300 border border-blue-700'
      case 'inactive':
        return 'bg-red-900 text-red-300 border border-red-700'
      default:
        return 'bg-gray-800 text-gray-300 border border-gray-600'
    }
  }

  const getStatusLabel = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'on_leave':
        return 'On Leave'
      case 'break':
        return 'On Break'
      case 'inactive':
        return 'Inactive'
      default:
        return 'Unknown'
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization
    const matchesLocation = !filterLocation || doctor.location.includes(filterLocation)
    const matchesStatus = !filterStatus || (doctor.status || 'active') === filterStatus
    // Show all doctors regardless of status - but allow filtering by status
    return matchesSearch && matchesSpecialization && matchesLocation && matchesStatus
  })

  const specializations = [...new Set(doctors.map(d => d.specialization))]
  const locations = [...new Set(doctors.map(d => d.location.split(',')[0]))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading doctors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadDoctors}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Doctors</h1>
              <p className="text-gray-300">Manage doctor profiles and schedules</p>
            </div>
            <button
              onClick={() => {
                resetAddForm()
                setShowAddModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded">
            {successMessage}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" className="text-gray-400">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={`specialization-${spec}`} value={spec} className="text-white">{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" className="text-gray-400">All Locations</option>
                {locations.map((location) => (
                  <option key={`location-${location}`} value={location} className="text-white">{location}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" className="text-gray-400">All Statuses</option>
                <option value="active" className="text-white">Active</option>
                <option value="on_leave" className="text-white">On Leave</option>
                <option value="break" className="text-white">On Break</option>
                <option value="inactive" className="text-white">Inactive</option>
              </select>
            </div>
            <div className="text-sm text-gray-300 flex items-center">
              <span>{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Doctor Profiles</h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {filteredDoctors.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No doctors match your search criteria</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="px-6 py-4 hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-300">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            {doctor.specialization}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <MapPin className="w-4 h-4 mr-2" />
                            {doctor.location}
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="font-medium">Email:</span> {doctor.email}
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="font-medium">Phone:</span> {doctor.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                        {getStatusLabel(doctor.status)}
                      </span>
                      <button 
                        onClick={() => openEditModal(doctor)}
                        className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      
                      {/* Status Dropdown */}
                      <div className="relative">
                        <select
                          value={doctor.status || 'active'}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newStatus = e.target.value as 'active' | 'on_leave' | 'break' | 'inactive';
                            updateDoctorStatus(doctor.id, newStatus);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm border border-gray-600 rounded-md px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="active" className="bg-gray-700 text-white">Set Active</option>
                          <option value="on_leave" className="bg-gray-700 text-white">On Leave</option>
                          <option value="break" className="bg-gray-700 text-white">On Break</option>
                          <option value="inactive" className="bg-gray-700 text-white">Set Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-700 w-[600px] shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Add New Doctor</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">First Name *</label>
                    <input 
                      type="text" 
                      required
                      value={addFormData.firstName}
                      onChange={(e) => setAddFormData({ ...addFormData, firstName: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      value={addFormData.lastName}
                      onChange={(e) => setAddFormData({ ...addFormData, lastName: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email *</label>
                    <input 
                      type="email" 
                      required
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Phone *</label>
                    <input 
                      type="tel" 
                      required
                      value={addFormData.phone}
                      onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Specialization *</label>
                    <input 
                      type="text" 
                      required
                      value={addFormData.specialization}
                      onChange={(e) => setAddFormData({ ...addFormData, specialization: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Gender</label>
                    <select 
                      value={addFormData.gender}
                      onChange={(e) => setAddFormData({ ...addFormData, gender: e.target.value as 'male' | 'female' | 'other' })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="male" className="text-white">Male</option>
                      <option value="female" className="text-white">Female</option>
                      <option value="other" className="text-white">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Location *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Building A, Floor 2" 
                    value={addFormData.location}
                    onChange={(e) => setAddFormData({ ...addFormData, location: e.target.value })}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetAddForm()
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    Add Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-700 w-[600px] shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Edit Doctor</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input 
                      type="text" 
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input 
                      type="text" 
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input 
                      type="email" 
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Phone</label>
                    <input 
                      type="tel" 
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Specialization</label>
                    <input 
                      type="text" 
                      value={editFormData.specialization}
                      onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Gender</label>
                    <select 
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as 'male' | 'female' | 'other' })}
                      className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="male" className="text-white">Male</option>
                      <option value="female" className="text-white">Female</option>
                      <option value="other" className="text-white">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Building A, Floor 2" 
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingDoctor(null)
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
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
