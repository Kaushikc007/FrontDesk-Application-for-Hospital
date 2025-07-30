import api from '@/lib/api'

export interface Patient {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  emergencyContact: string
  emergencyContactPhone?: string
  medicalHistory?: string
  createdAt: string
}

export interface CreatePatientData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  emergencyContact: string
  emergencyContactPhone?: string
  medicalHistory?: string
}

export interface PatientSearchParams {
  search?: string
  ageMin?: number
  ageMax?: number
}

export const patientService = {
  async getPatients(params?: PatientSearchParams): Promise<Patient[]> {
    const response = await api.get('/patients', { params })
    return response.data
  },

  async getPatientById(id: number): Promise<Patient> {
    const response = await api.get(`/patients/${id}`)
    return response.data
  },

  async createPatient(data: CreatePatientData): Promise<Patient> {
    const response = await api.post('/patients', data)
    return response.data
  },

  async updatePatient(id: number, data: Partial<CreatePatientData>): Promise<Patient> {
    const response = await api.patch(`/patients/${id}`, data)
    return response.data
  },

  async deletePatient(id: number): Promise<void> {
    await api.delete(`/patients/${id}`)
  },

  async searchPatients(query: string): Promise<Patient[]> {
    const response = await api.get('/patients/search', { params: { search: query } })
    return response.data
  }
}
