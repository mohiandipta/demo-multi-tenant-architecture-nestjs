import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

dotenv.config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) { }

    private async createDatabaseIfNotExists(tenantDB: string) {
        const connection = await mysql.createConnection({
            host: this.env.DB_HOST,
            port: Number(this.env.DB_PORT),
            user: this.env.DB_USERNAME,
            password: this.env.DB_PASSWORD,
        });

        const [rows] = await connection.query<RowDataPacket[]>(`SHOW DATABASES LIKE '${tenantDB}'`);
        if (rows.length === 0) {
            await connection.query(`CREATE DATABASE \`${tenantDB}\``);
        }

        await connection.end();
    }

    public async getTypeOrmConfig(tenantDB: string): Promise<TypeOrmModuleOptions> {
        await this.createDatabaseIfNotExists(tenantDB);

        return {
            type: 'mysql',
            host: this.env.DB_HOST,
            port: Number(this.env.DB_PORT),
            username: this.env.DB_USERNAME,
            password: this.env.DB_PASSWORD,
            database: tenantDB,
            logging: false,

            entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
            ],

            migrationsTableName: 'migration',
            migrations: [join(__dirname, '..', 'migrations', '*.ts')],

            synchronize: true,
        };
    }
}

const configService = new ConfigService(process.env);

export default configService;
