import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tblPAT')
export class PersonalAccessToken {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'int', nullable: false })
    intOrgId: number

    @Column({ type: 'int', nullable: false })
    intLastActionBy: number

    @Column({ type: 'varchar', length: 256, nullable: false })
    strExpireAt: string

    @Column({ type: 'datetime', nullable: false })
    dteTokenValidity: Date

    @Column({ type: 'varchar', length: 256, nullable: false })
    strTokenName: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strToken: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strDescription: string

    @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    dteCreatedAt: Date

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean
}
