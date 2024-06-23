import { NextRequest } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { generateResponse } from '../../../utils/response';
import { UploadFilesRequest, File, UploadFilesResponse, UploadFilesReceivedItem } from '../../../interfaces/api';
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
  const items: UploadFilesReceivedItem[] = [];

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^items\[(\d+)\]\.(id|file)$/);
    if (!match) continue;
    const [, index, type] = match;
    const itemIndex = parseInt(index, 10);
    
    // Ensure the item at index is initialized
    if (!items[itemIndex]) items[itemIndex] = { id: undefined, file: undefined};

    if (type === 'id' && typeof value === 'string') {
      items[itemIndex].id = value;
    } else if (type === 'file' && typeof value === 'object' && 'arrayBuffer' in value) {
      const timestamp = Date.now();
      let filename = value.name.replaceAll(" ", "_");
      filename = `${timestamp}_${filename}`;
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      const fileType = value.type;
      items[itemIndex].file = { filename, fileBuffer, fileType };
    }
  }

  return { items };
}

async function uploadFiles(sasToken: string, items: UploadFilesReceivedItem[], userEmail: string): Promise<UploadFilesResponse[]> {
  const url = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  const blobServiceClient = new BlobServiceClient(url);
  const containerClient = blobServiceClient.getContainerClient(userEmail);

  let uploadResponses: UploadFilesResponse[] = [];

  for (const { id, file } of items) {

    if (!file || !id) {
      uploadResponses.push({ id: '', filename: '', status: 'failed', error: new Error('File not found') });
      continue;
    }

    const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
    const fileStream = Readable.from(file.fileBuffer);

    try {
      await blockBlobClient.uploadStream(fileStream, file.fileBuffer.length, 20, {
        blobHTTPHeaders: { blobContentType: file.fileType }
      });
      uploadResponses.push({ id, filename: file.filename, status: 'success' });
    } catch (error) {
      uploadResponses.push({ id, filename: file.filename, status: 'failed', error: error as Error });
    }
  }

  return uploadResponses;
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

async function handleFileUpload(item: UploadFilesReceivedItem, userId: mongoose.Types.ObjectId, sasToken: string, userEmail: string) {
  const { file, id } = item;
  if (!file || !id) return { id: '', filename: '', status: 'failed', error: new Error('File or ID missing') };

  const uploadDoc = {
    id                    : id,
    user_id               : userId,
    directory             : userEmail,
    file_name             : file.filename,
    status                : 'Uploaded',
    status_description    : '',
    timestamp             : new Date()
  };

  const result = await Uploads.create(uploadDoc);
  const uploadId = result._id;

  try {
    const uploadResponses = await uploadFiles(sasToken, [item], userEmail);
    await updateFileStatus(uploadId, 'Processing');

    setTimeout(async () => {
      const processingResult = true; // Placeholder for actual processing logic
      if (processingResult) {
        await updateFileStatus(uploadId, 'Successful');
      } else {
        await updateFileStatus(uploadId, 'Failed', 'Processing error details');
      }
    }, 3000);

    return uploadResponses[0];
  } catch (e: any) {
    await updateFileStatus(uploadId, 'Failed', e.message);
    return { id, filename: file.filename, status: 'failed', error: e };
  }
}


export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { items } = await parseFormData(request);
    const sasToken = cookies().get(SAS_COOKIE_NAME);
    const { userId, userEmail  }= await getUserIdFromCookies();

    if (!sasToken) return generateResponse({ error: 'SAS token missing' }, 400);
    if (isSasTokenExpired()) return generateResponse({ error: 'SAS token has expired' }, 400);
    if (items.length === 0) return generateResponse({ error: 'No files were uploaded!' }, 400);

    const uploadResults = await Promise.all(items.map(item => handleFileUpload(item, userId, sasToken.value, userEmail)));

    return generateResponse({ message: 'Files uploaded successfully', results: uploadResults }, 200);
  } catch (e: any) {
    console.error(`Internal server error: ${e.message}`);
    return generateResponse({ message: 'Internal server error', error: e.message }, 500);
  }
}

export async function GET(): Promise<Response> {
  try {
    const { userId } = await getUserIdFromCookies();
    const uploads = await Uploads.find({ user_id: userId }).sort({ timestamp: -1 }).limit(10);

    const uploadStatuses = uploads.map(upload => ({
      id		: upload._id,
      filename	: upload.file_name,
      status	: upload.status
    }));

    return generateResponse({ uploads: uploadStatuses }, 200);
  } catch (e: any) {
    console.error(`Internal server error: ${e.message}`);
    return generateResponse({ message: 'Internal server error', error: e.message }, 500);
  }
}