// pages/api/get-sas-token.js
import { NextResponse } from 'next/server';
import { generateBlobSASQueryParameters, StorageSharedKeyCredential, ContainerSASPermissions, SASProtocol } from '@azure/storage-blob';

// Providing default values to ensure these variables are always defined as strings
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || 'default-account-key';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

export async function GET() {
  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const sasToken = generateBlobSASQueryParameters(
        {
          containerName: containerName,
          permissions: ContainerSASPermissions.parse('cwd'),
          startsOn: new Date(),
          expiresOn: expiryDate,
          protocol: SASProtocol.Https,
        }, 
        sharedKeyCredential
    ).toString();

    return NextResponse.json({ sasToken }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: 'Error generating SAS token', error: e.message }, { status: 500 });
  }
}
