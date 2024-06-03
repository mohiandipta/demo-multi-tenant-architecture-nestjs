import { BlobDeleteResponse, BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
    private readonly blobServiceClient: BlobServiceClient;

    constructor() {
        const accountName = process.env.AZURE_ACCOUNT_NAME;
        const accountKey = process.env.AZURE_ACCOUNT_KEY;
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential,
        );

        this.blobServiceClient = blobServiceClient;
    }

    async uploadImage(containerName: string, fileName: string, fileContent: Buffer) {
        try {
            // Replace spaces in fileName with underscores
            fileName = fileName.replace(/\s+/g, '_');
            const containerClient = this.blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            await blockBlobClient.upload(fileContent, fileContent.length)
            return `https://${containerClient.accountName}.blob.core.windows.net/${containerClient.containerName}/${blockBlobClient.name}`;
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }

    async deleteImage(imageUrl: string) {
        try {
            const urlParts = imageUrl.split('/');
            const containerName = urlParts[urlParts.length - 2]; // Second last part is container name
            const fileName = urlParts[urlParts.length - 1]; // Last part is file name

            const containerClient = this.blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            const response: BlobDeleteResponse = await blockBlobClient.delete();
            return response.requestId !== undefined; // Indicates successful deletion
        } catch (error) {
            console.error("Error deleting image:", error);
            // Continue execution regardless of the error
            return error; // Indicate failure
        }
    }
}
