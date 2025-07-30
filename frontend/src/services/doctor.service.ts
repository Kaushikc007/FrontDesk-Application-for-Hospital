import api from '@/lib/api'

export interface Doctor {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  gender: 'male' | 'female' | 'other'
  location: string
  availability: string
  isActive: boolean
  status?: 'active' | 'on_leave' | 'break' | 'inactive'
  createdAt: string
}

export interface CreateDoctorData {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  gender: 'male' | 'female' | 'other'
  location: string
  availability?: string
}

export interface DoctorSearchParams {
  search?: string
  specialization?: string
  isActive?: boolean
  gender?: string
}

export const doctorService = {
  async getDoctors(params?: DoctorSearchParams): Promise<Doctor[]> {
    const response = await api.get('/doctors', { params })
    return response.data
  },

  async getDoctorById(id: number): Promise<Doctor> {
    const response = await api.get(`/doctors/${id}`)
    return response.data
  },

  async createDoctor(data: CreateDoctorData): Promise<Doctor> {
    const response = await api.post('/doctors', data)
    return response.data
  },

  async updateDoctor(id: number, data: Partial<CreateDoctorData>): Promise<Doctor> {
    const response = await api.patch(`/doctors/${id}`, data)
    return response.data
  },

  async deleteDoctor(id: number): Promise<void> {
    await api.delete(`/doctors/${id}`)
  },

  async updateAvailability(id: number, isActive: boolean): Promise<Doctor> {
    const response = await api.patch(`/doctors/${id}/availability`, { isActive })
    return response.data
  },

  async updateStatus(id: number, status: 'active' | 'on_leave' | 'break' | 'inactive'): Promise<Doctor> {
    const isActive = status === 'active'
    const response = await api.patch(`/doctors/${id}`, { status, isActive })
    return response.data
  }
}
