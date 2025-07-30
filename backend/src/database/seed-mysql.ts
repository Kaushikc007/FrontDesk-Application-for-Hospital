import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Doctor, Gender, DoctorStatus } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import {
  QueueEntry,
  QueueStatus,
  Priority,
} from '../entities/queue-entry.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinic_management',
  entities: [User, Doctor, Patient, Appointment, QueueEntry],
  synchronize: true,
  logging: false,
});

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Clear existing data
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await AppDataSource.query('TRUNCATE TABLE appointments');
    await AppDataSource.query('TRUNCATE TABLE queue_entries');
    await AppDataSource.query('TRUNCATE TABLE doctors');
    await AppDataSource.query('TRUNCATE TABLE patients');
    await AppDataSource.query('TRUNCATE TABLE users');
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    // Seed Users
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await userRepository.save([
      {
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@clinic.com',
        employeeId: 'EMP001',
        role: UserRole.ADMIN,
      },
      {
        username: 'frontdesk1',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@clinic.com',
        employeeId: 'EMP002',
        role: UserRole.FRONT_DESK,
      },
      {
        username: 'frontdesk2',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@clinic.com',
        employeeId: 'EMP003',
        role: UserRole.FRONT_DESK,
      },
    ]);

    console.log('Users seeded successfully');

    // Seed Doctors
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const doctors = await doctorRepository.save([
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        gender: Gender.FEMALE,
        location: 'Building A, Floor 2',
        availability: JSON.stringify({
          monday: '09:00-17:00',
          tuesday: '09:00-17:00',
          wednesday: '09:00-17:00',
          thursday: '09:00-17:00',
          friday: '09:00-15:00',
        }),
        isActive: true,
        status: DoctorStatus.ACTIVE,
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Brown',
        email: 'michael.brown@clinic.com',
        phone: '+1-555-0102',
        specialization: 'Orthopedics',
        gender: Gender.MALE,
        location: 'Building B, Floor 1',
        availability: JSON.stringify({
          monday: '08:00-16:00',
          tuesday: '08:00-16:00',
          wednesday: '08:00-16:00',
          thursday: '08:00-16:00',
          friday: '08:00-12:00',
        }),
        isActive: true,
        status: DoctorStatus.ACTIVE,
      },
      {
        firstName: 'Dr. Emily',
        lastName: 'Davis',
        email: 'emily.davis@clinic.com',
        phone: '+1-555-0103',
        specialization: 'Pediatrics',
        gender: Gender.FEMALE,
        location: 'Building A, Floor 1',
        availability: JSON.stringify({
          monday: '10:00-18:00',
          tuesday: '10:00-18:00',
          wednesday: '10:00-18:00',
          thursday: '10:00-18:00',
          friday: '10:00-14:00',
        }),
        isActive: true,
        status: DoctorStatus.ON_LEAVE,
      },
      {
        firstName: 'Dr. Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@clinic.com',
        phone: '+1-555-0104',
        specialization: 'Dermatology',
        gender: Gender.MALE,
        location: 'Building C, Floor 2',
        availability: JSON.stringify({
          monday: '09:00-17:00',
          tuesday: '09:00-17:00',
          wednesday: '09:00-17:00',
          thursday: '09:00-17:00',
          friday: '09:00-13:00',
        }),
        isActive: true,
        status: DoctorStatus.BREAK,
      },
    ]);

    console.log('Doctors seeded successfully');

    // Seed Patients
    const patientRepository = AppDataSource.getRepository(Patient);
    const patients = await patientRepository.save([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1-555-1001',
        dateOfBirth: new Date('1985-03-15'),
        address: '123 Main St, Anytown, AT 12345',
        emergencyContact: 'Bob Johnson',
        emergencyContactPhone: '+1-555-1002',
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@email.com',
        phone: '+1-555-1003',
        dateOfBirth: new Date('1992-07-22'),
        address: '456 Oak Ave, Somewhere, SW 67890',
        emergencyContact: 'Mary Smith',
        emergencyContactPhone: '+1-555-1004',
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol.williams@email.com',
        phone: '+1-555-1005',
        dateOfBirth: new Date('1978-11-30'),
        address: '789 Pine Rd, Elsewhere, EW 11111',
        emergencyContact: 'David Williams',
        emergencyContactPhone: '+1-555-1006',
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@email.com',
        phone: '+1-555-1007',
        dateOfBirth: new Date('1990-01-10'),
        address: '321 Elm St, Nowhere, NW 22222',
        emergencyContact: 'Sarah Brown',
        emergencyContactPhone: '+1-555-1008',
      },
    ]);

    console.log('Patients seeded successfully');

    // Seed Appointments
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await appointmentRepository.save([
      {
        appointmentDate: today,
        appointmentTime: '09:00',
        duration: 30,
        status: AppointmentStatus.SCHEDULED,
        notes: 'Regular checkup',
        reasonForVisit: 'Annual physical examination',
        doctorId: doctors[0].id,
        patientId: patients[0].id,
        userId: users[1].id,
      },
      {
        appointmentDate: today,
        appointmentTime: '10:30',
        duration: 45,
        status: AppointmentStatus.CONFIRMED,
        notes: 'Follow-up appointment',
        reasonForVisit: 'Knee pain evaluation',
        doctorId: doctors[1].id,
        patientId: patients[1].id,
        userId: users[1].id,
      },
      {
        appointmentDate: tomorrow,
        appointmentTime: '14:00',
        duration: 30,
        status: AppointmentStatus.SCHEDULED,
        notes: 'Child vaccination',
        reasonForVisit: 'Routine vaccination',
        doctorId: doctors[2].id,
        patientId: patients[2].id,
        userId: users[2].id,
      },
    ]);

    console.log('Appointments seeded successfully');

    // Seed Queue Entries
    const queueRepository = AppDataSource.getRepository(QueueEntry);
    await queueRepository.save([
      {
        queueNumber: 1,
        status: QueueStatus.WAITING,
        priority: Priority.NORMAL,
        notes: 'Walk-in patient',
        patientId: patients[0].id,
        userId: users[1].id,
        doctorId: doctors[0].id,
      },
      {
        queueNumber: 2,
        status: QueueStatus.WAITING,
        priority: Priority.HIGH,
        notes: 'Urgent consultation needed',
        patientId: patients[3].id,
        userId: users[1].id,
        doctorId: doctors[1].id,
      },
    ]);

    console.log('Queue entries seeded successfully');

    console.log('Database seeding completed successfully!');
    console.log('\\nDefault login credentials:');
    console.log('Admin: admin / password123');
    console.log('Front Desk: frontdesk1 / password123');
    console.log('Front Desk: frontdesk2 / password123');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase().catch(console.error);
