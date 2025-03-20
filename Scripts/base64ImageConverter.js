export const convertToBase64 = async (file) => {
  let readyFile = null;

  try {
    if (typeof file === 'string') {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`fetching error Status: ${response.status}`);
      }
      readyFile = await response.blob();
    } else if (file instanceof Blob || file instanceof File) {
      readyFile = file;
    } else {
      throw new Error("file format is not correct");
    }

    if (!readyFile) {
      throw new Error("Failed to prepare the file for conversion."); // Handle the case where readyFile is still null/undefined
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(readyFile);
    });
  } catch (error) {
    console.error("Error converting to base64:", error);
    throw error;
  }
};