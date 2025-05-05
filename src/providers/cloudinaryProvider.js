import { v2 } from 'cloudinary';
import { env } from '~/config/environment';
v2.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET
});
const handleUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const base64String = req.file.buffer.toString('base64');
    const uploadStr = `data:${req.file.mimetype};base64,${base64String}`;

    const result = await v2.uploader.upload(uploadStr, {
      resource_type: 'auto',
      public_id: `pdfs/${Date.now()}-${req.file.originalname}`,
      folder: 'pdf_uploads',
      tags: ['pdf_upload']
    });
    if (result?.secure_url) {
      req.body.cvLink = result?.secure_url;
      next();
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
};
export const cloudProvider = {
  handleUpload
};
