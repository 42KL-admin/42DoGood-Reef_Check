import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

// Define an asynchronous POST function to handle incoming requests
export async function POST(request: NextRequest) {
  try {
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

    if (files.length === 0 || !sasToken) {
      return new Response(JSON.stringify({ message: 'Files or SAS token missing' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Create a new BlobServiceClient instance with the SAS token
    const url = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
    const blobServiceClient = new BlobServiceClient(url);

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Upload each file
    for (const { filename, fileBuffer, fileType } of files) {
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      const fileStream = Readable.from(fileBuffer);

      await blockBlobClient.uploadStream(fileStream, fileBuffer.length, 20, { 
        blobHTTPHeaders: { blobContentType: fileType } 
      });
    }

    return new Response(JSON.stringify({ message: 'Files uploaded successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ message: 'Internal server error', error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
