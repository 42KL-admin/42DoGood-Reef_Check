export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1] || "";
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(new Error("Error converting file to base64: " + error));
    };
  });
};
