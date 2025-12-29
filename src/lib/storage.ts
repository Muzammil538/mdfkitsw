// Cloudinary image upload utility

const CLOUD_NAME = "dgglif2wk";
const UPLOAD_PRESET = "mdfkitsw";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const uploadImage = async (
  file: File,
  folder: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data.secure_url;
};

export const uploadFile = async (
  file: File,
  folder: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  // Use 'auto' or 'raw' for generic files (like PDF)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload file to Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data.secure_url;
};

export const deleteImage = async (publicId: string): Promise<void> => {
  // Note: Cloudinary deletion requires server-side authentication
  // For client-side apps, images can be managed via Cloudinary dashboard
  console.log('Image deletion requires server-side implementation:', publicId);
};
