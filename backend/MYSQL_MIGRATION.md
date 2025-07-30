# MySQL Migration Guide

## Prerequisites

1. **Install MySQL Server**
   - Download and install MySQL Server from https://dev.mysql.com/downloads/
   - During installation, set a root password (remember this for configuration)

2. **Install MySQL Workbench (Optional)**
   - Download from https://dev.mysql.com/downloads/workbench/
   - Useful for database management and viewing data

## Database Setup

1. **Create Database**

   ```sql
   CREATE DATABASE clinic_management;
   ```

2. **Create a dedicated user (recommended)**
   ```sql
   CREATE USER 'clinic_user'@'localhost' IDENTIFIED BY 'clinic_password';
   GRANT ALL PRIVILEGES ON clinic_management.* TO 'clinic_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Environment Configuration

1. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

2. **Update .env file with your MySQL credentials**

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=India@567
   DB_NAME=clinic_management
   DB_SYNC=true
   DB_LOGGING=false

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_characters_long
   JWT_EXPIRES_IN=24h
   ```

## Migration Steps

1. **Install dependencies** (if not already done)

   ```bash
   npm install
   ```

2. **Run the application** (this will auto-create tables due to synchronize: true)

   ```bash
   npm run start:dev
   ```

3. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

## What Changed

### Database Technology

- **From:** MongoDB with Mongoose ODM
- **To:** MySQL with TypeORM

### Entity Changes

- **IDs:** ObjectId strings → Auto-incrementing integers
- **Relationships:** Manual references → Proper foreign keys
- **Validation:** Mongoose schemas → TypeORM decorators

### API Changes

- All entity IDs are now integers instead of MongoDB ObjectIds
- Relationships are properly managed by TypeORM
- Better query performance with SQL indexes

## Default Login Credentials

After seeding, you can login with:

- **Admin:** `admin` / `password123`
- **Front Desk:** `frontdesk1` / `password123`
- **Front Desk:** `frontdesk2` / `password123`

## Verification

1. **Check database tables:**

   ```sql
   USE clinic_management;
   SHOW TABLES;
   ```

2. **View sample data:**

   ```sql
   SELECT * FROM users;
   SELECT * FROM doctors;
   SELECT * FROM patients;
   ```

3. **Test the API:**
   - Start the backend: `npm run start:dev`
   - API should be running on http://localhost:3000
   - Test login endpoint: POST http://localhost:3000/auth/login

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Ensure MySQL server is running
   - Check host/port in .env file
   - Verify username/password

2. **Table creation fails:**
   - Ensure the database exists
   - Check user permissions
   - Set DB_SYNC=true for development

3. **Foreign key constraints:**
   - Run seeding script in correct order
   - Clear existing data before re-seeding

### Useful MySQL Commands

```sql
-- Check connection
SELECT 1;

-- View all databases
SHOW DATABASES;

-- View all tables in current database
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Reset database (CAUTION: Deletes all data)
DROP DATABASE clinic_management;
CREATE DATABASE clinic_management;
```

## Production Considerations

1. **Turn off synchronize:** Set `DB_SYNC=false` in production
2. **Use migrations:** Create proper TypeORM migrations for schema changes
3. **Security:** Use strong passwords and limit database user permissions
4. **Backup:** Set up regular database backups
5. **Performance:** Add proper indexes for frequently queried fields
