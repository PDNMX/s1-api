import debug from 'debug';
import * as dotenv from 'dotenv';
dotenv.config();


const log: debug.IDebugger = debug('app:config');
const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,        
    },
    port: process.env.API_S1_PORT || 4000,
    prefix: process.env.API_S1_PREFIX || 's1',
    oauth_mongodb: {
        host: process.env.MONGO_S1_HOST || '127.0.0.1',
        user: process.env.MONGO_S1_USER || 'root',
        pass: process.env.MONGO_S1_PASS || 'soporte',
        port: process.env.MONGO_S1_PORT || 27017,
        database: process.env.MONGO_S1_DATABASE || 'admin',
        authSource: process.env.MONGO_S1_DB_AUTH || 'admin'
    }
};

log("config: ", config);
export default config;