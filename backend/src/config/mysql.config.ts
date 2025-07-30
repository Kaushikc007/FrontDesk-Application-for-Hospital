import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { Doctor } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { QueueEntry } from '../entities/queue-entry.entity';

export const getMysqlConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_NAME', 'clinic_management'),
    entities: [User, Doctor, Patient, Appointment, QueueEntry],
    synchronize: configService.get('DB_SYNC', true),
    logging: configService.get('DB_LOGGING', false),
    autoLoadEntities: true,
  };
};
