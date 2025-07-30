'use client'

import { useState, useEffect } from 'react'
import { Clock, Plus, User, CheckCircle, XCircle, ArrowRight, SkipForward, Pause, RotateCcw, AlertTriangle } from 'lucide-react'
import { queueService, QueueEntry } from '@/services/queue.service'
import { usePatients } from '@/contexts/PatientContext'
import PatientSelector from '@/components/PatientSelector'

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const {} = usePatients() // PatientSelector component uses this context
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [error, setError] = useState('')

  // Load queue and patients
  useEffect(() => {
    loadQueue()
  }, [])

  const loadQueue = async () => {
    try {
      const queueData = await queueService.getQueue()
      setQueue(queueData)
    } catch (error) {
      console.error('Failed to load queue:', error)
      setError('Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  const addToQueue = async () => {
    if (!selectedPatient) return

    try {
      await queueService.addToQueue({
        patientId: selectedPatient,
        priority: selectedPriority
      })
      setShowAddModal(false)
      setSelectedPatient(null)
      setSelectedPriority('normal')
      loadQueue()
    } catch (error) {
      console.error('Failed to add to queue:', error)
      setError('Failed to add patient to queue')
    }
  }

  const updateStatus = async (id: number, status: QueueEntry['status']) => {
    try {
      await queueService.updateStatus(id, status)
      loadQueue()
    } catch (error) {
      console.error('Failed to update status:', error)
      setError('Failed to update queue status')
    }
  }

  const updatePriority = async (id: number, priority: 'low' | 'normal' | 'high' | 'urgent') => {
    try {
      // Update priority in queue array immediately for better UX
      setQueue(queue.map(entry => 
        entry.id === id ? { ...entry, priority } : entry
      ))
      // Here you would typically call an API to update priority
      // await queueService.updatePriority(id, priority)
    } catch (error) {
      console.error('Failed to update priority:', error)
      setError('Failed to update priority')
      // Revert on error
      loadQueue()
    }
  }

  const removeFromQueue = async (id: number) => {
    try {
      await queueService.removeFromQueue(id)
      loadQueue()
    } catch (error) {
      console.error('Failed to remove from queue:', error)
      setError('Failed to remove from queue')
    }
  }

  const handleRemoveFromQueue = (id: number) => {
    if (window.confirm('Are you sure you want to remove this patient from the queue?')) {
      removeFromQueue(id)
    }
  }

  // New functions for enhanced queue management
  const callNextPatient = async () => {
    const nextPatient = queue.find(entry => entry.status === 'waiting')
    if (nextPatient) {
      await updateStatus(nextPatient.id, 'with_doctor')
    }
  }

  const holdPatient = async (id: number) => {
    try {
      // Add a custom status for held patients or use waiting with a flag
      await updateStatus(id, 'waiting')
      loadQueue()
    } catch (error) {
      console.error('Failed to hold patient:', error)
      setError('Failed to hold patient')
    }
  }

  const markCompleted = async (id: number) => {
    await updateStatus(id, 'completed')
  }

  const resetQueue = () => {
    if (window.confirm('Are you sure you want to reset the entire queue? This will remove all completed and cancelled entries.')) {
      // Filter out completed and cancelled entries
      const activeQueue = queue.filter(entry => entry.status === 'waiting' || entry.status === 'with_doctor')
      setQueue(activeQueue)
    }
  }

  // Get queue statistics
  const queueStats = {
    total: queue.length,
    waiting: queue.filter(entry => entry.status === 'waiting').length,
    withDoctor: queue.filter(entry => entry.status === 'with_doctor').length,
    completed: queue.filter(entry => entry.status === 'completed').length,
    urgent: queue.filter(entry => entry.priority === 'urgent').length,
  }

  const nextPatient = queue.find(entry => entry.status === 'waiting')
  const currentPatient = queue.find(entry => entry.status === 'with_doctor')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-8 h-8 mr-3 text-purple-600" />
                Queue Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage patient queue and update status
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Queue
              </button>
              <button
                onClick={resetQueue}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Queue
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Queue Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{queueStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total in Queue</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Waiting</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{queueStats.withDoctor}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">With Doctor</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{queueStats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{queueStats.urgent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Urgent</div>
          </div>
        </div>

        {/* Current Patient & Next Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Patient */}
          <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Current Patient
            </h3>
            {currentPatient ? (
              <div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {currentPatient.patient?.firstName} {currentPatient.patient?.lastName}
                </div>
                <div className="text-blue-700 dark:text-blue-300 mt-1">
                  Priority: <span className="capitalize">{currentPatient.priority}</span>
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  Queue Time: {new Date(currentPatient.createdAt).toLocaleTimeString()}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => markCompleted(currentPatient.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Complete
                  </button>
                  <button
                    onClick={() => holdPatient(currentPatient.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Pause className="w-4 h-4 inline mr-1" />
                    Hold
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-blue-700 dark:text-blue-300">No patient with doctor currently</div>
            )}
          </div>

          {/* Next Patient */}
          <div className="bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2" />
              Next Patient
            </h3>
            {nextPatient ? (
              <div>
                <div className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {nextPatient.patient?.firstName} {nextPatient.patient?.lastName}
                </div>
                <div className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Priority: <span className="capitalize">{nextPatient.priority}</span>
                  {nextPatient.priority === 'urgent' && (
                    <AlertTriangle className="w-4 h-4 inline ml-1 text-red-500" />
                  )}
                </div>
                <div className="text-yellow-700 dark:text-yellow-300">
                  Waiting since: {new Date(nextPatient.createdAt).toLocaleTimeString()}
                </div>
                <div className="mt-4">
                  <button
                    onClick={callNextPatient}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Call Next Patient
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-yellow-700 dark:text-yellow-300">No patients waiting</div>
            )}
          </div>
        </div>

        {/* Queue List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Queue Management</h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">All</option>
                  <option value="waiting">Waiting</option>
                  <option value="with_doctor">With Doctor</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients"
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 pr-8 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {queue.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No patients in queue</p>
              </div>
            ) : (
              queue.map((entry, index) => {
                // Calculate estimated wait time (15 minutes per person ahead)
                const estimatedWaitMinutes = index * 15;
                const arrivalTime = new Date(entry.createdAt);
                
                return (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Queue Number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Patient Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {entry.patient?.firstName || 'Unknown'} {entry.patient?.lastName || 'Patient'}
                            </h3>
                            {entry.priority === 'urgent' && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              entry.status === 'with_doctor' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.status === 'waiting' ? 'Waiting' : 
                               entry.status === 'with_doctor' ? 'With Doctor' : 
                               entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Side - Arrival Time, Est. Wait, Priority, Actions */}
                      <div className="flex items-center space-x-6">
                        {/* Arrival Time & Est. Wait */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div>Arrival: {arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div>Est. Wait: {estimatedWaitMinutes} min</div>
                        </div>
                        
                        {/* Status Dropdown */}
                        <div className="min-w-[120px]">
                          <select 
                            value={entry.status}
                            onChange={(e) => updateStatus(entry.id, e.target.value as QueueEntry['status'])}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="waiting">Waiting</option>
                            <option value="with_doctor">With Doctor</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        
                        {/* Priority Dropdown */}
                        <div className="min-w-[100px]">
                          <select 
                            value={entry.priority}
                            onChange={(e) => updatePriority(entry.id, e.target.value as 'low' | 'normal' | 'high' | 'urgent')}
                            className={`w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm text-white font-medium ${
                              entry.priority === 'urgent' ? 'bg-red-600' :
                              entry.priority === 'high' ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}
                          >
                            <option value="normal" className="bg-white text-gray-900">Normal</option>
                            <option value="high" className="bg-white text-gray-900">High</option>
                            <option value="urgent" className="bg-white text-gray-900">Critical</option>
                          </select>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromQueue(entry.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Add New Patient Button */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Add New Patient to Queue
            </button>
          </div>
        </div>
      </div>

      {/* Add to Queue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Patient to Queue</h3>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addToQueue(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient</label>
                  <div className="mt-1">
                    <PatientSelector
                      value={selectedPatient || ''}
                      onChange={(patientId) => setSelectedPatient(patientId)}
                      placeholder="Select a patient"
                      className="dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <select 
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'normal' | 'high' | 'urgent')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setSelectedPatient(null)
                      setSelectedPriority('normal')
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                  >
                    Add to Queue
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
