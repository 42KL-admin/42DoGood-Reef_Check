import {
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  ContainerSASPermissions,
  SASProtocol,
  BlobSASPermissions,
} from '@azure/storage-blob';
import { generateResponse } from '../../../utils/response';
import { cookies } from 'next/headers';
import { SAS_COOKIE_NAME, isSasTokenExpired } from '../utils';

// Providing default values to ensure these variables are always defined as strings
const accountName =
  process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const accountKey =
  process.env.AZURE_STORAGE_ACCOUNT_KEY || 'default-account-key';
const containerName =
  process.env.AZURE_STORAGE_EXCEL_TEMPLATE_CONTAINER ||
  'default-container-name';

// Function to generate SAS token
function generateSasToken(): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey,
  );

  const currentDate = new Date();
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 5); // 5 days in the past

  const expiryDate = new Date();
  expiryDate.setDate(currentDate.getDate() + 5); // 5 days in the future

  return generateBlobSASQueryParameters(
    {
      containerName: containerName,
      blobName: 'reef-check-templates.xlsx',
      permissions: BlobSASPermissions.parse('cr'),
      // permissions: ContainerSASPermissions.parse('cwd'),
      startsOn: startDate,
      expiresOn: expiryDate,
      protocol: SASProtocol.HttpsAndHttp,
      version: '2022-11-02',
    },
    sharedKeyCredential,
  ).toString();
}

// Main GET handler
export async function GET(): Promise<Response> {
  try {
    let sasToken;
    const existingSasToken = cookies().get(SAS_COOKIE_NAME);

    if (!existingSasToken || isSasTokenExpired()) {
      sasToken = generateSasToken();
    } else {
      sasToken = existingSasToken.value;
    }

    cookies().set(SAS_COOKIE_NAME, sasToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 3600,
    });

    return generateResponse(
      {
        data: {
          sasToken: existingSasToken,
          message: 'SAS token generated successfully',
        },
      },
      200,
    );
  } catch (e: any) {
    console.error(e);
    return generateResponse(
      { message: 'Error generating SAS token', error: e.message },
      500,
    );
  }
}
