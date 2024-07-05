import { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin as string) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default corsOptions;