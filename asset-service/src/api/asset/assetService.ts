import { S3 } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import type { Asset } from './assetModel';

export class AssetService {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async uploadFile(
        file: Express.Multer.File
    ): Promise<ServiceResponse<Asset | null>> {
        // Get the current date and time
        const now = new Date();
        const formattedDate = now
            .toISOString()
            .replace(/[:\-T]/g, '')
            .split('.')[0]; // Format as YYYYMMDDHHMMSS

        // Create the new file name
        const newFileName = `${formattedDate}_${file.originalname}`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: newFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        try {
            const data = await this.s3.upload(params).promise();
            return ServiceResponse.success<Asset>(
                'File uploaded successfully',
                {
                    assetUrl: data.Location,
                }
            );
        } catch (error) {
            const errorMessage = `Error uploading file to S3: ${(error as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                'An error occurred while uploading the file.',
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export const assetService = new AssetService();
