// import * as sharp from 'sharp';

// export const compressImage = async (imageBuffer: Buffer, originalFilename: string) => {
//     let imageProcessor = sharp(imageBuffer);

//     const format = originalFilename.split('.').pop()?.toLowerCase();
//     if (format === 'heic') {
//         // If HEIC format, convert to JPEG
//         imageProcessor = imageProcessor.jpeg({ quality: 80 });
//     } else {
//         // For other formats (JPEG, PNG), apply compression directly
//         imageProcessor = imageProcessor.resize({ width: 800 }).jpeg({ quality: 80 });
//     }

//     return imageProcessor.toBuffer();
// };
