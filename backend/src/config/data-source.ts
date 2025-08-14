import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_DATABASE || 'mydatabase',
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
    synchronize: true,
    logging: true,
});