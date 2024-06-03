// src/database/database.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService {
  public getAdminDataSourceOptions(): DataSourceOptions {
    try {
      return {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
  
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
  
        migrationsTableName: 'migration',
        migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  
        synchronize: true,
      };
    } catch (error) {
      console.log(error)
    }
  }

  private adminDataSource: DataSource;

  private async getAdminDataSource(): Promise<DataSource> {
    if (!this.adminDataSource) {
      this.adminDataSource = new DataSource(this.getAdminDataSourceOptions());
      await this.adminDataSource.initialize();
    }
    return this.adminDataSource;
  }

  async createTenantDatabase(tenantName: string) {
    const dataSource = await this.getAdminDataSource();
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      // Check if the database already exists
      await queryRunner.query(`USE ${tenantName}`);
      throw new UnauthorizedException("Database already exists with this name");
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Re-throw the specific exception
        throw error;
      } else {
        // If the database does not exist, create it
        await queryRunner.query(`CREATE DATABASE ${tenantName}`);
        return "Database created!";
      }
    } finally {
      await queryRunner.release();
      await dataSource.destroy();
      this.adminDataSource = null; // Reset to ensure a new connection is created next time
    }
  }

  async getTenantConnection() {
    const connectionName = process.env.DB_USERNAME;

    const dataSourceOptions: DataSourceOptions = {
      name: connectionName,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };

    let dataSource = new DataSource(dataSourceOptions);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    return dataSource;
  }
}
