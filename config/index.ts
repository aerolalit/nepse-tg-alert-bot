import * as dotenv from 'dotenv';
process.env['NODE_CONFIG_DIR'] = __dirname;

const loadEnv = (env:any) => dotenv.config({ path: `${env}` });

loadEnv(`.env.${process.env.NODE_ENV}.local`);
loadEnv(`.env.local`);
loadEnv(`.env.${process.env.NODE_ENV}`);
loadEnv(`.env`);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');

const configuration = config.util.loadFileConfigs(__dirname);
config.util.makeImmutable(configuration);

const cfg = configuration || configuration.default;

export default cfg;
