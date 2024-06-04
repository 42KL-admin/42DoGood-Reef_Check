import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { URLSearchParams } from 'url';
import { generateResponse } from '../../utils/response';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

// Function to validate SAS token
async function isSasTokenExpired(sasToken: string): Promise<boolean> {
  const params = new URLSearchParams(sasToken);
  const expiryTime = params.get('se');
  if (!expiryTime) return true;

  const expiryDate = new Date(expiryTime);
  const currentDate = new Date();

  return currentDate >= expiryDate;
}

// Function to parse form data
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  let sasToken;
  const files = [];

  for (const [key, value] of formData.entries()) {
    if (key === 'sasToken') {
      sasToken = value.toString();
    } else if (key === 'file' && typeof value === 'object' && 'arrayBuffer' in value) {
      const filename = value.name.replaceAll(" ", "_");
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      const fileType = value.type;
      files.push({ filename, fileBuffer, fileType });
    }
  }

  return { sasToken, files };
}

// Function to upload files to Azure Blob Storage
async function uploadFiles(sasToken: string, files: Array<{ filename: string, fileBuffer: Buffer, fileType: string }>) {
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
export async function POST(request: NextRequest) {
  try {
    const { sasToken, files } = await parseFormData(request);

    if (files.length === 0 || !sasToken)
      return generateResponse({ message: 'Files or SAS token missing' }, 400);

    if (await isSasTokenExpired(sasToken))
      return generateResponse({ message: 'SAS token has expired' }, 400);

    await uploadFiles(sasToken, files);

    return generateResponse({ message: 'Files uploaded successfully' }, 200);
  } catch (e: any) {
    console.error(e);
    return generateResponse({ message: 'Internal server error' }, 500, e.message);
  }
}
