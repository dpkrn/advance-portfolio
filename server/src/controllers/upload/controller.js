import { uploadToCloudinary, deleteFromCloudinary } from '../../external-services/cloudinary/index.js';

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.body.folder || 'portfolio'
    );
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'publicId required' });
    await deleteFromCloudinary(publicId);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
