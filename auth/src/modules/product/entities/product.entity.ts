import { Column, Decimal128, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tblProducts')
export class Product {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'int', nullable: false })
    intCategoryId: number

    @Column({ type: 'int', nullable: true })
    intSubCategoryId: number

    @Column({ type: 'int', nullable: true })
    intAdditionalCategoryId: number

    @Column({ type: 'uuid', generated: "uuid", length: 512, nullable: false })
    strUuid: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strItem: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strSlug: string

    @Column({ type: 'varchar', length: 1024, nullable: true })
    strDescription: string

    @Column({ type: 'int', nullable: true })
    intUnitId: number

    @Column({ type: 'int', nullable: true })
    intUOM: number

    @Column({ type: 'varchar', length: 1024, nullable: true })
    strUnit: string

    @Column({ type: 'varchar', length: 1024, nullable: true })
    strPackSize: string

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: () => '0.00' })
    decCostPrice: Decimal128

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    decMrpPrice: Decimal128

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    decOfferPrice: Decimal128

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0.0 })
    decPrePaidAmount: Decimal128

    @Column({ type: 'boolean', nullable: true })
    isFeatured: boolean

    @Column({ type: 'boolean', nullable: true })
    isStock: boolean

    @Column({ type: 'boolean', nullable: true })
    isCan: boolean

    @Column({ type: 'varchar', length: 512, nullable: true })
    strThumbnailUuid: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strThumbnailUrl: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strHighQUuid: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strHighQUrl: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strLowQUuid: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strLowQUrl: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strIconUuid: string

    @Column({ type: 'varchar', length: 512, nullable: true })
    strIconUrl: string

    @Column({ type: 'int', nullable: false })
    intLastActionBy: number

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteCreatedAt: Date

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteUpdatedAt: Date

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean
    length: number;
}
