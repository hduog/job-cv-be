import { WHITELIST_DOMAINS } from '~/utils/constants';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true); //null khong loi va true cho phep di qua
    }
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`)
    );
  },

  optionsSuccessStatus: 200,

  credentials: true
};
