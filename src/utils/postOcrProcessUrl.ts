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
      body: { url: imageUrl },
      header: {
        'Content-Type': 'application/json',
        'x-return-json': isReturnJson.toString(),
      },
    };
    console.log('requestParam: ', requestParams);

    const response = await ocrUploadApiCall(requestParams);

    let filename = 'downloaded-file.xlsx'; // Default filename
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    // Convert response array buffer to Blob and trigger download
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: response.headers.get('Content-Type') || 'application/octet-stream',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`File saved as ${filename}`);
  } catch (error) {
    console.error('Error:', error);
  }
};
