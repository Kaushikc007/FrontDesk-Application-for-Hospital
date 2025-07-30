import api from '@/lib/api'

export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes: string
  reasonForVisit: string
  patient: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  doctor: {
    id: number
    firstName: string
    lastName: string
    specialization: string
  }
  createdAt: string
}

export interface CreateAppointmentData {
  patientId: number
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  duration?: number
  notes?: string
  reasonForVisit?: string
}

export interface AppointmentSearchParams {
  patientId?: number
  doctorId?: number
  status?: string
  startDate?: string
  endDate?: string
}

export const appointmentService = {
  async getAppointments(params?: AppointmentSearchParams): Promise<Appointment[]> {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  async getAppointmentById(id: number): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await api.post('/appointments', data)
    return response.data
  },

  async updateAppointment(id: number, data: Partial<CreateAppointmentData>): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}`, data)
    return response.data
  },

  async updateStatus(id: number, status: Appointment['status']): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/status`, { status })
    return response.data
  },

  async deleteAppointment(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`)
  },

  async getTodaysAppointments(): Promise<Appointment[]> {
    const response = await api.get('/appointments/today')
    return response.data
  }
}
