import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
    NODE_ENV: str({
        devDefault: testOnly('test'),
        choices: ['development', 'production', 'test'],
    }),
    HOST: host({ devDefault: testOnly('localhost') }),
    PORT: port({ devDefault: testOnly(3000) }),
    AWS_ACCESS_KEY_ID: str(),
    AWS_SECRET_ACCESS_KEY: str(),
    AWS_REGION: str(),
    AWS_S3_BUCKET_NAME: str(),
});
