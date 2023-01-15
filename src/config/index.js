import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URL,

  passportSecret: process.env.COOKIE_SECRET,

  emails: {
    user: process.env.NARUMAILER_USER,
    pass: process.env.NARUMAILER_PASS
  },

  AWS_CONFIG: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION
  },

  AWS_BUCKET: process.env.AWS_BUCKET
};