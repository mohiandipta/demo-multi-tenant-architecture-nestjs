import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('tblRole')
export class Role {
    @PrimaryGeneratedColumn()
    intId: number

    @Column({ type: 'enum', enum: ['super-user', 'admin', 'user'], default: 'user' })
    strRoleName: any;

    @Column({ type: 'int', nullable: false })
    intCreatedBy: number

    @Column({ type: 'datetime', nullable: false })
    dteCreatedAt: Date

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean
}
