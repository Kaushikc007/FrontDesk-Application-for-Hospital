import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueueService } from './queue.service';
import { QueueEntry, QueueStatus } from '../entities/queue-entry.entity';

@Controller('queue')
@UseGuards(AuthGuard('jwt'))
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  getCurrentQueue(): Promise<QueueEntry[]> {
    return this.queueService.getCurrentQueue();
  }

  @Post()
  addToQueue(@Body() queueData: Partial<QueueEntry>): Promise<QueueEntry> {
    return this.queueService.addToQueue(queueData);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: QueueStatus,
  ): Promise<QueueEntry | null> {
    return this.queueService.updateQueueStatus(parseInt(id), status);
  }
}
