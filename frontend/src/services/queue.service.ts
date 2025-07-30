import api from '@/lib/api'

export interface QueueEntry {
  id: number
  queueNumber: number
  status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  patient: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  createdAt: string
}

export interface CreateQueueEntryData {
  patientId: number
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export const queueService = {
  async getQueue(): Promise<QueueEntry[]> {
    const response = await api.get('/queue')
    return response.data
  },

  async addToQueue(data: CreateQueueEntryData): Promise<QueueEntry> {
    const response = await api.post('/queue', data)
    return response.data
  },

  async updateStatus(id: number, status: QueueEntry['status']): Promise<QueueEntry> {
    const response = await api.patch(`/queue/${id}/status`, { status })
    return response.data
  },

  async removeFromQueue(id: number): Promise<void> {
    await api.delete(`/queue/${id}`)
  },

  async getQueuePosition(patientId: number): Promise<{ position: number; estimatedWait: number }> {
    const response = await api.get(`/queue/position/${patientId}`)
    return response.data
  }
}
