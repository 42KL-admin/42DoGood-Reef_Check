import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

export async function generateBlobSasToken() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getMinutes() + 1); // Set token to expire in 30 minutes

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    permissions: 'wcd',
    startsOn: new Date(),
    expiresOn: expiryDate,
  }, sharedKeyCredential).toString();

  return sasToken;
}
