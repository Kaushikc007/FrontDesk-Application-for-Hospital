import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { QueueEntry, QueueStatus } from '../entities/queue-entry.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry)
    private queueRepository: Repository<QueueEntry>,
  ) {}

  async addToQueue(queueData: Partial<QueueEntry>): Promise<QueueEntry> {
    const nextQueueNumber = await this.getNextQueueNumber();
    const queueEntry = this.queueRepository.create({
      ...queueData,
      queueNumber: nextQueueNumber,
    });
    return this.queueRepository.save(queueEntry);
  }

  async getCurrentQueue(): Promise<QueueEntry[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.queueRepository.find({
      where: {
        createdAt: Between(today, tomorrow),
      },
      relations: ['patient', 'doctor', 'user'],
      order: { queueNumber: 'ASC' },
    });
  }

  async updateQueueStatus(
    id: number,
    status: QueueStatus,
  ): Promise<QueueEntry | null> {
    await this.queueRepository.update(id, { status });
    return this.queueRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'user'],
    });
  }

  private async getNextQueueNumber(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastEntry = await this.queueRepository.findOne({
      where: {
        createdAt: Between(today, tomorrow),
      },
      order: { queueNumber: 'DESC' },
    });

    return lastEntry ? lastEntry.queueNumber + 1 : 1;
  }
}
