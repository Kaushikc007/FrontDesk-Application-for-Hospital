import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../entities/appointment.entity';
import { ValidatedUser } from '../auth/auth.service';

interface AuthenticatedRequest extends Request {
  user: ValidatedUser;
}

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('by-date')
  getByDate(@Query('date') date: string): Promise<Appointment[]> {
    return this.appointmentsService.getAppointmentsByDate(new Date(date));
  }

  @Get('today')
  getTodaysAppointments(): Promise<Appointment[]> {
    const today = new Date();
    return this.appointmentsService.getAppointmentsByDate(today);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appointment | null> {
    return this.appointmentsService.findById(parseInt(id));
  }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    // Extract user ID from JWT token
    const appointmentWithUser = {
      ...appointmentData,
      userId: req.user.id,
    };

    return this.appointmentsService.create(appointmentWithUser);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Appointment>,
  ): Promise<Appointment | null> {
    return this.appointmentsService.update(parseInt(id), updateData);
  }
}
