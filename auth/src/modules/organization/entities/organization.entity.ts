import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tblOrganization')
export class Organization {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'varchar', length: 512, nullable: false })
    strOrganizationName: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    strOrganizationCode: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    strDescription: string;

    @Column({ type: 'varchar', length: 512, nullable: false })
    strIndustryType: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    strWebsite: string;

    @Column({ type: 'int', nullable: false })
    intServiceId: number;

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteCreatedAt: Date;

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteUpdatedAt: Date;

    @Column({ type: 'boolean', default: true })
    blnIsActive: boolean;

    @Column({ type: 'int', nullable: true })
    intCreatedBy: number;
}
