import { generateBlobSASQueryParameters, StorageSharedKeyCredential, ContainerSASPermissions, SASProtocol } from '@azure/storage-blob';
import { generateResponse } from '../../../utils/response';

// Providing default values to ensure these variables are always defined as strings
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'default-account-name';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || 'default-account-key';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container-name';

// Function to generate SAS token
function generateSasToken() {
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

  return sasToken;
}

// Main GET handler
export async function GET() {
  try {
    const sasToken = generateSasToken();
    return generateResponse({ message: 'SAS token generated successfully', sasToken }, 200);
  } catch (e: any) {
    console.error(e);
    return generateResponse({ message: 'Error generating SAS token' }, 500, e.message);
  }
}
