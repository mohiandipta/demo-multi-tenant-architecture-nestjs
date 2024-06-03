// excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { MyGateway } from 'src/socket.io/gateway';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'

@WebSocketGateway()
@Injectable()
export class ExcelService {
    @WebSocketServer()
    server: Server

    constructor(
        private myGateway: MyGateway
    ) { }
    async createSampleExcel(rows: any) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SampleWizard');

        // Add headers
        worksheet.addRow(
            rows
        );

        // Generate the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async readExcel(fileBuffer: Buffer, expectedHeaders: string[], fileType: string) {
        try {
            if (fileType === 'xlsx' || fileType === 'xls') {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(fileBuffer);

                const worksheet = workbook.worksheets[0];
                const headers = worksheet.getRow(1).values as string[];

                const missingHeaders = this.getMissingHeaders(expectedHeaders, headers);
                if (missingHeaders.length > 0) {
                    throw new Error(`Headers in the Excel file are missing: ${missingHeaders.join(', ')}`);
                }

                const missingValues = this.getMissingValues(worksheet);
                if (missingValues.length > 0) {
                    throw new Error(`Some cells in the Excel file have missing values in rows: ${missingValues.join(', ')}`);
                }

                const data = [];
                for (let row = 2; row <= worksheet.rowCount; row++) {
                    const rowData = worksheet.getRow(row).values as string[];

                    const json = headers.reduce((acc, header, index) => {
                        acc[header] = rowData[index];
                        return acc;
                    }, {});
                    data.push(json);
                    const totalProducts = worksheet.rowCount - 1;
                    // console.log("totalProducts", totalProducts);
                    const body = {
                        fileSize: fileBuffer.length / 1024,
                        currentProduct: worksheet.getRow(row).values[1] as string,
                        totalProducts: totalProducts,
                        remainingProducts: totalProducts - (totalProducts - (row-2))
                    }
                    this.myGateway.onUpload(body)

                }
                return data;
            } else if (fileType === 'csv') {
                const data: any[] = [];
                fileBuffer
                    .toString()
                    .split('\n')
                    .forEach((line: string, index: number) => {
                        if (line.trim().length === 0) {
                            return; // Skip empty lines
                        }
                        if (index === 0) {
                            const headers = line.trim().split(',');
                            const missingHeaders = this.getMissingHeaders(expectedHeaders, headers);
                            if (missingHeaders.length > 0) {
                                throw new Error(`Headers in the CSV file are missing: ${missingHeaders.join(', ')}`);
                            }
                        } else {
                            const rowData = line.trim().split(',');
                            const json = expectedHeaders.reduce((acc, header, index) => {
                                acc[header] = rowData[index];
                                return acc;
                            }, {});
                            data.push(json);

                            const csvRows = fileBuffer.toString().split('\n');
                            const totalProducts = csvRows.length - 2;

                            const body = {
                                fileSize: fileBuffer.length / 1024,
                                currentProduct: rowData[0] as string,
                                totalProducts: totalProducts,
                                remainingProducts: totalProducts - (totalProducts - (index-1)) 
                            }
                            this.myGateway.onUpload(body)
                        }
                    });
                return data;
            } else {
                throw new Error('Unsupported file type');
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 400,
                message: error.message
            };
        }
    }

    private getMissingHeaders(expectedHeaders: string[], actualHeaders: string[]): string[] {
        return expectedHeaders.filter(header => !actualHeaders.includes(header));
    }

    private getMissingValues(worksheet: ExcelJS.Worksheet): string[] {
        const missingValues: string[] = [];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (cell.value === null || cell.value === undefined) {
                    missingValues.push(`(${rowNumber}, ${colNumber})`);
                }
            });
        });

        return missingValues;
    }
}
