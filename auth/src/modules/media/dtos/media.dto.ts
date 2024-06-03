export class MediaDTO {
    readonly strFilename: string
    readonly strFileurl: string
    readonly strFiletype: any['jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'tiff' | 'tif' | 'webp' | 'svg']
    readonly intCreatedBy: number
    readonly dteCreatedAt: Date
    readonly isActive: boolean
}
