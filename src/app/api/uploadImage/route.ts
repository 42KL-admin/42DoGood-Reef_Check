import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { generateResponse } from '../../../utils/response';
import { UploadFilesRequest, File } from '../../../interfaces/api';
import { SAS_COOKIE_NAME, isSasTokenExpired } from '../utils';
import { cookies } from 'next/headers';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

// Function to parse form data
async function parseFormData(request: NextRequest): Promise<UploadFilesRequest> {
  const formData = await request.formData();
  const files: File[] = [];

  for (const [key, value] of formData.entries()) {
    if (key === 'files' && typeof value === 'object' && 'arrayBuffer' in value) {
      const timestamp = Date.now();
      let filename = value.name.replaceAll(" ", "_");
      filename = `${timestamp}_${filename}`;
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      const fileType = value.type;
      files.push({ filename, fileBuffer, fileType });
    }
  }

  return { files };
}

// Function to upload files to Azure Blob Storage
async function uploadFiles(sasToken: string, files: File[]): Promise<void> {
  const url = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  const blobServiceClient = new BlobServiceClient(url);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  for (const { filename, fileBuffer, fileType } of files) {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    const fileStream = Readable.from(fileBuffer);

    await blockBlobClient.uploadStream(fileStream, fileBuffer.length, 20, {
      blobHTTPHeaders: { blobContentType: fileType }
    });
  }
}

// Main POST handler
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { files } = await parseFormData(request);
    const sasToken = cookies().get(SAS_COOKIE_NAME);

    if (!sasToken)
      return generateResponse({ error: 'SAS token missing' }, 400);

    if (isSasTokenExpired())
      return generateResponse({ error: 'SAS token has expired' }, 400);

    if (files.length === 0)
      return generateResponse({ error: 'Files missing' }, 400);

    await uploadFiles(sasToken.value, files);

    return generateResponse({ message: 'Files uploaded successfully' }, 200);
  } catch (e: any) {
    console.error(e);
    return generateResponse({ message: 'Internal server error', error: e.message }, 500);
  }
}
