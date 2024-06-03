import * as qrcode from 'qrcode';

export const qrCodeGenerator = async (data: any) => {
    try {
        const svg = await qrcode.toString(data, { type: 'svg' });
        return svg;
    } catch (error) {
        console.log(error);
        throw new Error('QR Code generation failed');
    }
};
