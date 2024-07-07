import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { generateResponse } from '../../../utils/response';
import {
  UploadFilesRequest,
  File,
  UploadFilesResponse,
  UploadFilesReceivedItem,
} from '../../../interfaces/api';
import { isSasTokenExpired } from '../utils';
import { cookies } from 'next/headers';
import { COOKIE_TOKEN } from '@/enums/cookie';

const accountName =
  process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const containerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';
const SAS_COOKIE_NAME = COOKIE_TOKEN.REEF_CHECK_SLATE;

// Function to parse form data
async function parseFormData(
  request: NextRequest,
): Promise<UploadFilesRequest> {
  const formData = await request.formData();
  const items: UploadFilesReceivedItem[] = [];

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^items\[(\d+)\]\.(id|file)$/);
    if (!match) continue;
    const [, index, type] = match;
    const itemIndex = parseInt(index, 10);

    // Ensure the item at index is initialized
    if (!items[itemIndex])
      items[itemIndex] = { id: undefined, file: undefined };

    if (type === 'id' && typeof value === 'string') {
      items[itemIndex].id = value;
    } else if (
      type === 'file' &&
      typeof value === 'object' &&
      'arrayBuffer' in value
    ) {
      const timestamp = Date.now();
      let filename = value.name.replaceAll(' ', '_');
      filename = `${timestamp}_${filename}`;
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      const fileType = value.type;
      items[itemIndex].file = { filename, fileBuffer, fileType };
    }
  }

  return { items };
}

// Function to upload files to Azure Blob Storage
async function uploadFiles(
  sasToken: string,
  items: UploadFilesReceivedItem[],
): Promise<UploadFilesResponse[]> {
  const url = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  const blobServiceClient = new BlobServiceClient(url);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let uploadResponses: UploadFilesResponse[] = [];

  for (const { id, file } of items) {
    if (!file || !id) {
      uploadResponses.push({
        id: '',
        filename: '',
        status: 'failed',
        error: new Error('File not found'),
      });
      continue;
    }

    const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
    const fileStream = Readable.from(file.fileBuffer);

    try {
      await blockBlobClient.uploadStream(
        fileStream,
        file.fileBuffer.length,
        20,
        {
          blobHTTPHeaders: { blobContentType: file.fileType },
        },
      );
      uploadResponses.push({ id, filename: file.filename, status: 'success' });
    } catch (error) {
      uploadResponses.push({
        id,
        filename: file.filename,
        status: 'failed',
        error: error as Error,
      });
    }
  }

  return uploadResponses;
}

// Main POST handler
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { items } = await parseFormData(request);
    const sasToken = cookies().get(SAS_COOKIE_NAME);

    if (!sasToken) return generateResponse({ error: 'SAS token missing' }, 400);

    if (isSasTokenExpired(SAS_COOKIE_NAME))
      return generateResponse({ error: 'SAS token has expired' }, 400);

    if (items.length === 0)
      return generateResponse({ error: 'No files were uploaded!' }, 400);

    const uploadResults = await uploadFiles(sasToken.value, items);

    return generateResponse(
      {
        message: 'Files uploaded successfully',
        results: uploadResults,
      },
      200,
    );
  } catch (e: any) {
    console.error(e);
    return generateResponse(
      { message: 'Internal server error', error: e.message },
      500,
    );
  }
}
