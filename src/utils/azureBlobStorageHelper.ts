import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { apiCall } from './apiCall';

// Having a problem to use process.env.xxx as it will always give me an empty value, i have to hard code the keys here for it work
// Need to find a way to somehow get this to work because I can't get it, server/client issue?
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
const containerName = process.env.AZURE_STORAGE_EXCEL_TEMPLATE_CONTAINER || '';

const sasTokenApiUrl = `api/sasToken`;

const TemplateFileName: { [key: string]: any } = Object.freeze({
  substrate: 'substrate-template.xlsx',
  fishInverts: 'fish-invert-template.xlsx',
});

export const fetchSasToken = async (): Promise<{
  name: string;
  value: string;
  path: string;
}> => {
  try {
    const response = await apiCall(sasTokenApiUrl, 'GET');
    const sasTokenObj = response.data.sasToken;
    return sasTokenObj;
  } catch (e: any) {
    throw new Error(`Failed to fetch SAS token: ${e.message}`);
  }
};

export const fetchTemplateFromBlobStorage = async (
  sasToken: string,
  templateType: string,
) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new AnonymousCredential(),
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobClient = containerClient.getBlobClient(
      TemplateFileName[templateType],
    );

    const blobUrlWithSAS = `${blobClient.url}?${sasToken}`;

    // temporarily not using SAS cause I can't fix the settings
    const blobUrlWithoutSas = `https://reefcheckslates.blob.core.windows.net/reef-excel-templates/${TemplateFileName[templateType]}`;

    const response = await apiCall(
      blobUrlWithoutSas,
      'GET',
      undefined,
      undefined,
      true,
    );

    return response;
  } catch (e: any) {
    throw new Error(`Failed to fetch blob: ${e.message}`);
  }
};
