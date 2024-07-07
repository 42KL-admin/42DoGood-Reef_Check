import { SlateUploadItem } from '@/stores/types';
import { apiCall } from '@/utils/apiCall';

const uploadSlateApiUrl = `api/uploadImage`;

export async function uploadSlatesToBlob(items: SlateUploadItem[]) {
  const formData = new FormData();
  items.forEach((item, index) => {
    formData.append(`items[${index}].id`, item.id);
    formData.append(`items[${index}].file`, item.file);
  });

  try {
    const response = await apiCall(uploadSlateApiUrl, 'POST', formData, true);
    return response;
  } catch (e: any) {
    console.log('error uploading slates: ', e.message);
    throw new Error('uploadSlatesToBlob error: ', e.message);
  }
}
