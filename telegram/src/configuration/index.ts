import { config } from 'dotenv';
config();

export const apiId = parseInt(process.env.API_ID);
export const apiHash = process.env.API_HASH;
export const stringSession = process.env.STRING_SESSION;
export const phoneNumber = process.env.PHONE_NUMBER;
export const srcChannelIds = process.env.SOURCE_CHANNEL_ID.split(' ');
export const desChannelId = process.env.DESTINATION_CHANNEL_ID;
export const db = process.env.MONGO_URL;
