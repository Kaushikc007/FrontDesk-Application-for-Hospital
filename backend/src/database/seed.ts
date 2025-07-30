import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { DatabaseSeeder } from './seeder';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const seeder = new DatabaseSeeder(dataSource);
  await seeder.run();

  await app.close();
}

runSeeder().catch(console.error);
