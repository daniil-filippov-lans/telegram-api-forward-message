import { connectDb } from './helpers/db';
import { startServer } from './tgClient';

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb)
    .once('open', startServer);
