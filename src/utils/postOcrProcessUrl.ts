import { apiCall } from './apiCall';
import { customApiCall } from './customApiCall';
import { ocrUploadApiCall } from './ocrUploadApiCall';

const apiUrl = 'https://reefocr.azurewebsites.net/api/process-url';

export const postOcrProcessUrl = async (
  imageUrl: string,
  isReturnJson: boolean = false,
) => {
  try {
    const requestParams: RequestBody.OcrProcessUrl = {
      apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'x-return-json': isReturnJson.toString(),
      },
    };
    const response = await ocrUploadApiCall(requestParams);
    // const filename = response.headers['contentdisposition'].split('filename=')[1];
    //  fs.writeFileSync(filename, response.data);
    // console.log(`File saved as ${filename}`);
  } catch (error) {
    console.error('Error:', error);
  }
};
