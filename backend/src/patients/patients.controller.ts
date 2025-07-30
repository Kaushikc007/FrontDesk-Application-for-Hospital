import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';
import { Patient } from '../entities/patient.entity';

@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Patient | null> {
    return this.patientsService.findById(parseInt(id));
  }

  @Post()
  create(@Body() patientData: Partial<Patient>): Promise<Patient> {
    return this.patientsService.create(patientData);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Patient>,
  ): Promise<Patient | null> {
    return this.patientsService.update(parseInt(id), updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.patientsService.delete(parseInt(id));
  }

  @Get('search')
  search(@Query('q') query: string): Promise<Patient[]> {
    return this.patientsService.searchPatients(query);
  }
}
