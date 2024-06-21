import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { generateResponse } from '../../../utils/response';
import { UploadFilesRequest, File } from '../../../interfaces/api';
import { SAS_COOKIE_NAME, USER_COOKIE, isSasTokenExpired } from '../utils';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import Users from '@/models/Users';
import Uploads from '@/models/Uploads';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

async function updateFileStatus(uploadId: mongoose.Types.ObjectId, status: string, description = '') {
  const upload = await Uploads.findById(uploadId);
  if (upload) {
    upload.status = status;
    upload.status_description = description;
    await upload.save();
  } else {
    console.error(`Upload with ID ${uploadId} not found.`);
  }
}

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

async function uploadFiles(sasToken: string, files: File[], userEmail: string): Promise<void> {
  const url = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  const blobServiceClient = new BlobServiceClient(url);
  const containerClient = blobServiceClient.getContainerClient(userEmail);

  for (const { filename, fileBuffer, fileType } of files) {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    const fileStream = Readable.from(fileBuffer);

    await blockBlobClient.uploadStream(fileStream, fileBuffer.length, 20, {
      blobHTTPHeaders: { blobContentType: fileType }
    });
  }
}

async function getUserEmailFromCookies(): Promise<string> {
    const userCookie = cookies().get(USER_COOKIE);
    if (!userCookie) throw new Error('User cookie missing');

    const userEmail = JSON.parse(userCookie.value).email;
    if (!userEmail) throw new Error('Email doesn\'t exist');
    return userEmail;
}

// Function to get the user ID and email from cookies
async function getUserIdFromCookies(): Promise<{ userId: mongoose.Types.ObjectId, userEmail: string }> {
    const userEmail = await getUserEmailFromCookies();
    const user = await Users.findOne({ email: userEmail });
    if (!user) throw new Error('User not found');

    return { userId: user._id, userEmail };
}

async function handleFileUpload(file: File, userId: mongoose.Types.ObjectId, sasToken: string, userEmail: string) {
  const uploadDoc = {
    user_id: userId,
    directory: userEmail,
    file_name: file.filename,
    status: 'Uploaded',
    status_description: '',
    timestamp: new Date()
  };

  const result = await Uploads.create(uploadDoc);
  const uploadId = result._id;

  try {
    await uploadFiles(sasToken, [file], userEmail);
    await updateFileStatus(uploadId, 'Processing');

    setTimeout(async () => {
      const processingResult = true; // Placeholder for actual processing logic
      if (processingResult) {
        await updateFileStatus(uploadId, 'Successful');
      } else {
        await updateFileStatus(uploadId, 'Failed', 'Processing error details');
      }
    }, 3000);
  } catch (e: any) {
    await updateFileStatus(uploadId, 'Failed', e.message);
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { files } = await parseFormData(request);
    const sasToken = cookies().get(SAS_COOKIE_NAME);
    if (!sasToken) return generateResponse({ error: 'SAS token missing' }, 400);
    if (isSasTokenExpired()) return generateResponse({ error: 'SAS token has expired' }, 400);
    if (files.length === 0) return generateResponse({ error: 'Files missing' }, 400);

    const { userId, userEmail  }= await getUserIdFromCookies();

    console.log('userEmail = ', userEmail);
    
    const uploadPromises = files.map(file => handleFileUpload(file, userId, sasToken.value, userEmail));
    await Promise.all(uploadPromises);

    return generateResponse({ message: 'Files uploaded successfully' }, 200);
  } catch (e: any) {
    console.error(`Internal server error: ${e.message}`);
    return generateResponse({ message: 'Internal server error', error: e.message }, 500);
  }
}
