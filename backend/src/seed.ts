import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { DoctorsService } from './doctors/doctors.service';
import { PatientsService } from './patients/patients.service';
import { UserRole } from './entities/user.entity';
import { Gender } from './entities/doctor.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const doctorsService = app.get(DoctorsService);
  const patientsService = app.get(PatientsService);

  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminUser = await usersService.create({
      username: 'admin',
      email: 'admin@clinic.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });
    console.log('✅ Admin user created:', adminUser.username);

    // Create front desk user
    const frontDeskUser = await usersService.create({
      username: 'frontdesk',
      email: 'frontdesk@clinic.com',
      password: 'desk123',
      firstName: 'Front',
      lastName: 'Desk',
      role: UserRole.FRONT_DESK,
    });
    console.log('✅ Front desk user created:', frontDeskUser.username);

    // Create sample doctors
    const doctor1 = await doctorsService.create({
      firstName: 'Dr. John',
      lastName: 'Smith',
      email: 'john.smith@clinic.com',
      phone: '+1234567890',
      specialization: 'Cardiology',
      gender: Gender.MALE,
      location: 'Building A, Floor 2',
      availability: JSON.stringify({
        monday: '09:00-17:00',
        tuesday: '09:00-17:00',
        wednesday: '09:00-17:00',
        thursday: '09:00-17:00',
        friday: '09:00-15:00',
      }),
    });
    console.log('✅ Doctor created:', doctor1.firstName, doctor1.lastName);

    const doctor2 = await doctorsService.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@clinic.com',
      phone: '+1234567891',
      specialization: 'Pediatrics',
      gender: Gender.FEMALE,
      location: 'Building B, Floor 1',
      availability: JSON.stringify({
        monday: '08:00-16:00',
        tuesday: '08:00-16:00',
        wednesday: '08:00-16:00',
        thursday: '08:00-16:00',
        friday: '08:00-14:00',
      }),
    });
    console.log('✅ Doctor created:', doctor2.firstName, doctor2.lastName);

    // Create sample patients
    const patient1 = await patientsService.create({
      firstName: 'Alice',
      lastName: 'Cooper',
      email: 'alice.cooper@email.com',
      phone: '+1987654321',
      dateOfBirth: new Date('1985-06-15'),
      address: '123 Main St, City, State 12345',
      emergencyContact: 'Bob Cooper',
      emergencyContactPhone: '+1987654322',
    });
    console.log('✅ Patient created:', patient1.firstName, patient1.lastName);

    const patient2 = await patientsService.create({
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@email.com',
      phone: '+1987654323',
      dateOfBirth: new Date('1990-03-22'),
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: 'Jane Wilson',
      emergencyContactPhone: '+1987654324',
    });
    console.log('✅ Patient created:', patient2.firstName, patient2.lastName);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Admin: admin / admin123');
    console.log('Front Desk: frontdesk / desk123');
  } catch (error) {
    console.error(
      '❌ Seeding failed:',
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    await app.close();
  }
}

void seed();
