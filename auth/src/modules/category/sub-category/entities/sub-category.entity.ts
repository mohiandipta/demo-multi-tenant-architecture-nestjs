import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('tblSubCategory')
export class SubCategory {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'int', nullable: false })
    intCategoryId: number

    @Column({ type: 'varchar', length: 512, nullable: false })
    strSubCategoryName: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strDescription: string

    @Column({ type: 'varchar', length: 512, nullable: true })
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
