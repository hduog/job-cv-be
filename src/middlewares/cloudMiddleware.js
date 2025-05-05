import { cloudProvider } from '~/providers/cloudinaryProvider';

const uploadFile = async (req, res, next) => {
  try {
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const cldRes = await cloudProvider.handleUpload(dataURI);
      req.body.cvLink = cldRes.url;
    }
    next();
  } catch (error) {
    next(new Error(error));
  }
};
export const cloudMiddleware = {
  uploadFile
};
