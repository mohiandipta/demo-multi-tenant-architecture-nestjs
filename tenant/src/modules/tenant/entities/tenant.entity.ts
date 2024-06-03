import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    strName: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    strEmail: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    strPassword: string;
}
