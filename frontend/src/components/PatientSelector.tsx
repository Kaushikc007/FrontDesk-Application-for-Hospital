'use client'

import { usePatients } from '@/contexts/PatientContext'
import { User } from 'lucide-react'

interface PatientSelectorProps {
  value: string | number
  onChange: (patientId: number) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export default function PatientSelector({
  value,
  onChange,
  placeholder = "Select a patient",
  className = "",
  required = false
}: PatientSelectorProps) {
  const { patients, loading } = usePatients()

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <select
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
        >
          <option>Loading patients...</option>
        </select>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      >
        <option value="" className="text-gray-500">
          {placeholder}
        </option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id} className="text-gray-900">
            {patient.firstName} {patient.lastName} - {patient.email}
          </option>
        ))}
      </select>
      
      {patients.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md p-2">
          <User className="inline h-4 w-4 mr-1" />
          No patients found. Add patients in the Patients tab first.
        </div>
      )}
    </div>
  )
}
