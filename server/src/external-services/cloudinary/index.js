import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryConfig } from '../../config/cloudinary.js';

function configure() {
  cloudinary.config(getCloudinaryConfig());
}

export async function uploadToCloudinary(buffer, folder = 'portfolio', options = {}) {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        ...options,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId) {
  configure();
  return cloudinary.uploader.destroy(publicId);
}
