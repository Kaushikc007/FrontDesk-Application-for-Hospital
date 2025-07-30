import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { Doctor, Gender } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    await this.seedUsers();
    await this.seedDoctors();
    await this.seedPatients();
    console.log('Database seeded successfully!');
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { username: 'admin' },
    });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminUser = userRepository.create({
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });

    await userRepository.save(adminUser);
    console.log('Admin user created: admin / admin123');
  }

  private async seedDoctors() {
    const doctorRepository = this.dataSource.getRepository(Doctor);

    const existingDoctors = await doctorRepository.count();
    if (existingDoctors > 0) {
      console.log('Doctors already exist');
      return;
    }

    const doctors = [
      {
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'john.smith@clinic.com',
        phone: '+1234567890',
        specialization: 'Cardiology',
        gender: Gender.MALE,
        location: 'Building A, Room 101',
        availability: 'Mon-Fri 9AM-5PM',
        licenseNumber: 'MD123456',
        experience: 10,
        rating: 4.8,
        consultationFee: 150,
      },
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1234567891',
        specialization: 'Dermatology',
        gender: Gender.FEMALE,
        location: 'Building A, Room 102',
        availability: 'Mon-Fri 8AM-4PM',
        licenseNumber: 'MD123457',
        experience: 8,
        rating: 4.9,
        consultationFee: 120,
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Brown',
        email: 'michael.brown@clinic.com',
        phone: '+1234567892',
        specialization: 'Pediatrics',
        gender: Gender.MALE,
        location: 'Building B, Room 201',
        availability: 'Tue-Thu 10AM-6PM',
        licenseNumber: 'MD123458',
        experience: 12,
        rating: 4.7,
        consultationFee: 100,
      },
    ];

    await doctorRepository.save(doctors);
    console.log('Sample doctors created');
  }

  private async seedPatients() {
    const patientRepository = this.dataSource.getRepository(Patient);

    const existingPatients = await patientRepository.count();
    if (existingPatients > 0) {
      console.log('Patients already exist');
      return;
    }

    const patients = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1234567893',
        dateOfBirth: new Date('1990-01-15'),
        address: '123 Main St, City, State 12345',
        emergencyContact: 'Jane Doe',
        emergencyContactPhone: '+1234567894',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1234567895',
        dateOfBirth: new Date('1985-05-20'),
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Bob Smith',
        emergencyContactPhone: '+1234567896',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1234567897',
        dateOfBirth: new Date('1978-11-10'),
        address: '789 Pine Rd, City, State 12345',
        emergencyContact: 'Mary Johnson',
        emergencyContactPhone: '+1234567898',
      },
    ];

    await patientRepository.save(patients);
    console.log('Sample patients created');
  }
}
