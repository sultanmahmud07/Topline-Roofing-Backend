import { google } from 'googleapis';
import { envVars } from './env';

const oauth2Client = new google.auth.OAuth2(
  envVars.GOOGLE_CLIENT_ID,
  envVars.GOOGLE_CLIENT_SECRET,
  envVars.GOOGLE_CALLBACK_URL
);

oauth2Client.setCredentials({ refresh_token: envVars.GOOGLE_REFRESH_TOKEN });

export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
