import { v2 as cloudinary } from 'cloudinary';

function ensureConfigured() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    ensureConfigured();

    const folder = req.body.folder || 'portfolio';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'publicId required' });
    ensureConfigured();
    await cloudinary.uploader.destroy(publicId);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
