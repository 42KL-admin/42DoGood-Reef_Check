import { apiCall } from '@/utils/apiCall';

const uploadSlateApiUrl = `api/uploadImage`;

export async function uploadSlatesToBlob(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await apiCall(uploadSlateApiUrl, 'POST', formData, true);
    return response;
  } catch (e: any) {
    console.log('error uploading slates', e.message);
    throw new Error('uploadSlatesToBlob error', e.message);
  }
}
