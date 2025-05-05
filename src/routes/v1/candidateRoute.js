import express from 'express';
import { candidateController } from '~/controllers/candidateController';
import { candidateValidation } from '~/validations/candidateValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
import { cloudProvider } from '~/providers/cloudinaryProvider';
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
  upload.single('cvLink'),
  cloudProvider.handleUpload,
  candidateValidation.createNew,
  candidateController.createNew
);

Router.route('/list-candidate').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  candidateController.getListCandidates
);
Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  candidateController.deleteCandidate
);
Router.route('/change-status/:status/:id/:email').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  candidateController.changeStatus
);
Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER, ROLE_USER.INTERVIEER]),
  candidateController.getCandidateDetails
);
Router.route('/jobs-applied').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
  candidateController.getJobsApplied
);
export const candidateRouter = Router;
