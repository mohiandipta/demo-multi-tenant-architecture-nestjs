import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('tblCategory')
export class Category {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'varchar', length: 512, nullable: false })
    strCategoryName: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strDescription: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strImageURL: string

    @Column({ type: 'int', nullable: false })
    intCreatedBy: number

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteCreatedAt: Date

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteUpdatedAt: Date

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean
}
