import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import routes from './routes/index';

const app = express();
app.use(json());
app.use('/' + config.prefix, routes);

// last middleware
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`server is listening on port ${config.port}`);
});