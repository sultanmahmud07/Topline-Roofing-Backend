"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmail = void 0;
const googleapis_1 = require("googleapis");
const env_1 = require("./env");
const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.envVars.GOOGLE_CLIENT_ID, env_1.envVars.GOOGLE_CLIENT_SECRET, env_1.envVars.GOOGLE_CALLBACK_URL);
oauth2Client.setCredentials({ refresh_token: env_1.envVars.GOOGLE_REFRESH_TOKEN });
exports.gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client });
