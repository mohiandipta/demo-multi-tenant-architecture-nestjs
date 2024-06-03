import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('tblMedia')
export class Media {
    @PrimaryGeneratedColumn()
    intId: number;

    @Column({ type: 'uuid', generated:"uuid" , length: 512, nullable: false })
    uuid: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strFilename: string

    @Column({ type: 'varchar', length: 512, nullable: false })
    strFileurl: string

    @Column({ type: 'enum', enum: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg'] })
    strFiletype: any;

    @Column({ type: 'int', nullable: false })
    intCreatedBy: number

    @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dteCreatedAt: Date

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean
}
