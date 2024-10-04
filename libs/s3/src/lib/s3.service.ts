import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1' // e.g., 'us-west-2'
      // credentials: {
      //   accessKeyId: 'your-access-key-id',
      //   secretAccessKey: 'your-secret-access-key',
      // },
    });
  }

  async uploadFile(bucketName: string, fileName: string, fileContent: Buffer , mimeType:string,fileExtension:string): Promise<string> {
    const commandInput: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: `${fileName}.${fileExtension}`,
      Body: fileContent,
      ACL: 'public-read', // Set public access
      ContentEncoding: 'base64',
      ContentType: mimeType
    };

    const command = new PutObjectCommand(commandInput);
    await this.s3Client.send(command);

    // Return the public URL
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  }

}

