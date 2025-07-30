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
import { DoctorsService } from './doctors.service';
import { Doctor, Gender, DoctorStatus } from '../entities/doctor.entity';

@Controller('doctors')
@UseGuards(AuthGuard('jwt'))
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get('search')
  search(
    @Query()
    filters: {
      specialization?: string;
      location?: string;
      gender?: Gender;
      status?: DoctorStatus;
    },
  ): Promise<Doctor[]> {
    return this.doctorsService.searchDoctors(filters);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusData: { status: DoctorStatus },
  ): Promise<Doctor | null> {
    return this.doctorsService.updateStatus(parseInt(id), statusData.status);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Doctor | null> {
    return this.doctorsService.findById(parseInt(id));
  }

  @Post()
  create(@Body() doctorData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.create(doctorData);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Doctor>,
  ): Promise<Doctor | null> {
    return this.doctorsService.update(parseInt(id), updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.doctorsService.remove(parseInt(id));
  }
}
