import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { getExcelTemplateApiCall } from './getExcelTemplateApiCall';
import { getSlatesApiCall } from './getSlatesApiCall';

// Having a problem to use process.env.xxx as it will always give me an empty value, i have to hard code the keys here for it work
// Need to find a way to somehow get this to work because I can't get it, server/client issue?
const accountName = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME || '';
const containerName =
  process.env.NEXT_PUBLIC_AZURE_STORAGE_EXCEL_TEMPLATE_CONTAINER || '';

const TemplateFileName: { [key: string]: any } = Object.freeze({
  substrate: 'substrate-template.xlsx',
  fishInverts: 'fish-invert-template.xlsx',
});

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

    const requestParams: RequestBody.UploadTemplateFromBlobStorage = {
      blobUrl: blobUrlWithoutSas,
      method: 'GET',
    };

    const response = await getExcelTemplateApiCall(requestParams);

    return response;
  } catch (e: any) {
    throw new Error(`Failed to fetch blob: ${e.message}`);
  }
};

export const getSlateImageUrl = async (imageName: string) => {
  try {
    // const blobServiceClient = new BlobServiceClient(
    //   `https://${accountName}.blob.core.windows.net`,
    //   new AnonymousCredential(),
    // );

    // const containerClient = blobServiceClient.getContainerClient(containerName);

    // const blobClient = containerClient.getBlobClient(
    //   TemplateFileName[templateType],
    // );

    // const blobUrlWithSAS = `${blobClient.url}?${sasToken}`;

    // temporarily not using SAS cause I can't fix the settings
    const blobUrlWithoutSas = `https://reefcheckslates.blob.core.windows.net/slates/slates/${imageName}`;

    const requestParams: RequestBody.OcrProcessUrl = {
      apiUrl: blobUrlWithoutSas,
      method: 'GET',
      body: { url: blobUrlWithoutSas },
    };
    console.log('requestparams: ', requestParams);

    const response = await getSlatesApiCall(requestParams);

    return response;
  } catch (e: any) {
    throw new Error(`Failed to fetch blob: ${e.message}`);
  }
};
