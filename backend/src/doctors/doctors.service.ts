import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor, Gender, DoctorStatus } from '../entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({ where: { isActive: true } });
  }

  async findById(id: number): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ where: { id, isActive: true } });
  }

  async update(
    id: number,
    updateData: Partial<Doctor>,
  ): Promise<Doctor | null> {
    await this.doctorRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.doctorRepository.update(id, { isActive: false });
  }

  async searchDoctors(filters: {
    specialization?: string;
    location?: string;
    gender?: Gender;
    status?: DoctorStatus;
  }): Promise<Doctor[]> {
    const where: Record<string, any> = { isActive: true };

    if (filters.specialization) {
      where.specialization = Like(`%${filters.specialization}%`);
    }

    if (filters.location) {
      where.location = Like(`%${filters.location}%`);
    }

    if (filters.gender) {
      where.gender = filters.gender;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return this.doctorRepository.find({ where });
  }

  async updateStatus(id: number, status: DoctorStatus): Promise<Doctor | null> {
    await this.doctorRepository.update(id, { status });
    return this.findById(id);
  }
}
