'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { patientService, Patient } from '@/services/patient.service'

interface PatientContextType {
  patients: Patient[]
  loading: boolean
  error: string | null
  loadPatients: () => Promise<void>
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<Patient>
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<Patient>
  deletePatient: (id: number) => Promise<void>
  refreshPatients: () => Promise<void>
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export const usePatients = () => {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider')
  }
  return context
}

interface PatientProviderProps {
  children: ReactNode
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const patientsData = await patientService.getPatients()
      setPatients(patientsData)
    } catch (err) {
      console.error('Failed to load patients:', err)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    try {
      setError(null)
      const newPatient = await patientService.createPatient(patientData)
      setPatients(prev => [...prev, newPatient])
      return newPatient
    } catch (err) {
      console.error('Failed to add patient:', err)
      setError('Failed to add patient')
      throw err
    }
  }

  const updatePatient = async (id: number, patientData: Partial<Patient>) => {
    try {
      setError(null)
      const updatedPatient = await patientService.updatePatient(id, patientData)
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p))
      return updatedPatient
    } catch (err) {
      console.error('Failed to update patient:', err)
      setError('Failed to update patient')
      throw err
    }
  }

  const deletePatient = async (id: number) => {
    try {
      setError(null)
      await patientService.deletePatient(id)
      setPatients(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete patient:', err)
      setError('Failed to delete patient')
      throw err
    }
  }

  const refreshPatients = async () => {
    await loadPatients()
  }

  // Load patients on mount
  useEffect(() => {
    loadPatients()
  }, [])

  const value: PatientContextType = {
    patients,
    loading,
    error,
    loadPatients,
    addPatient,
    updatePatient,
    deletePatient,
    refreshPatients
  }

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  )
}
