import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblLoginInfo')
export class LoginInfo {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'int', width: 50, nullable: true })
    intUserId: number;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    strEmail: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    strPhone: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    strPassword: string;

    @Column({ type: 'int', width: 50, nullable: true })
    intOtp: number;
    
    @Column({ type: 'varchar', length: 512, nullable: true })
    strAccess_token: string;
    
    @Column({ type: 'varchar', length: 512, nullable: true })
    strRefresh_token: string;

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteLastLogin: Date;
}
