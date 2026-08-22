"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const gmail_1 = require("../../config/gmail");
// Helper to find a specific header value
const getHeader = (headers, name) => {
    const header = headers === null || headers === void 0 ? void 0 : headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
};
// Helper to recursively parse and extract the body of a Gmail message
const getMessageBody = (payload) => {
    let text = '';
    let html = '';
    if (!payload)
        return { text, html };
    if (payload.body && payload.body.data) {
        const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        if (payload.mimeType === 'text/plain') {
            text = decoded;
        }
        else if (payload.mimeType === 'text/html') {
            html = decoded;
        }
    }
    if (payload.parts) {
        for (const part of payload.parts) {
            const parsed = getMessageBody(part);
            if (parsed.text)
                text += parsed.text;
            if (parsed.html)
                html += parsed.html;
        }
    }
    return { text, html };
};
// Parse a single message object from Gmail API response
const parseMessage = (msg) => {
    var _a;
    const headers = ((_a = msg.payload) === null || _a === void 0 ? void 0 : _a.headers) || [];
    const from = getHeader(headers, 'From');
    const to = getHeader(headers, 'To');
    const subject = getHeader(headers, 'Subject');
    const date = getHeader(headers, 'Date');
    const messageId = getHeader(headers, 'Message-ID');
    const { text, html } = getMessageBody(msg.payload);
    return {
        id: msg.id,
        threadId: msg.threadId,
        messageId,
        from,
        to,
        subject,
        date,
        snippet: msg.snippet || '',
        bodyText: text,
        bodyHtml: html || text, // Fallback to text if html is empty
    };
};
/**
 * Fetch all threads from the admin's inbox
 */
const getInboxThreads = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield gmail_1.gmail.users.threads.list({
        userId: 'me',
        q: 'label:INBOX',
        maxResults: 20
    });
    const threads = response.data.threads || [];
    const parsedThreads = yield Promise.all(threads.map((t) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const threadDetails = yield gmail_1.gmail.users.threads.get({
                userId: 'me',
                id: t.id
            });
            const messages = threadDetails.data.messages || [];
            const lastMessage = messages[messages.length - 1];
            const parsedLast = parseMessage(lastMessage);
            return {
                id: t.id,
                snippet: t.snippet,
                messageCount: messages.length,
                lastMessage: parsedLast,
                subject: parsedLast.subject,
                from: parsedLast.from,
                date: parsedLast.date
            };
        }
        catch (err) {
            console.error(`Failed to fetch thread details for ${t.id}:`, err);
            return null;
        }
    })));
    return parsedThreads.filter(t => t !== null);
});
/**
 * Fetch all message history for a specific user email
 */
const getEmailHistory = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield gmail_1.gmail.users.threads.list({
        userId: 'me',
        q: `to:${email} OR from:${email}`,
        maxResults: 10
    });
    const threads = response.data.threads || [];
    const parsedHistory = yield Promise.all(threads.map((t) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const threadDetails = yield gmail_1.gmail.users.threads.get({
                userId: 'me',
                id: t.id
            });
            const messages = threadDetails.data.messages || [];
            const parsedMessages = messages.map(msg => parseMessage(msg));
            return {
                threadId: t.id,
                subject: ((_a = parsedMessages[0]) === null || _a === void 0 ? void 0 : _a.subject) || 'No Subject',
                messages: parsedMessages
            };
        }
        catch (err) {
            console.error(`Failed to fetch thread details for user history ${t.id}:`, err);
            return null;
        }
    })));
    return parsedHistory.filter(h => h !== null);
});
/**
 * Send a reply email to an existing thread
 */
const sendReply = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { threadId, to, subject, body } = payload;
    // 1. Fetch the thread to find the latest message details (to thread properly)
    const threadDetails = yield gmail_1.gmail.users.threads.get({
        userId: 'me',
        id: threadId
    });
    const messages = threadDetails.data.messages || [];
    if (messages.length === 0) {
        throw new Error('Cannot reply to an empty thread.');
    }
    const latestMessage = messages[messages.length - 1];
    const latestHeaders = ((_a = latestMessage.payload) === null || _a === void 0 ? void 0 : _a.headers) || [];
    const latestMessageId = getHeader(latestHeaders, 'Message-ID');
    // 2. Prepare Email Headers
    const emailSubject = subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`;
    const headers = [
        `To: ${to}`,
        `Subject: ${emailSubject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
    ];
    if (latestMessageId) {
        headers.push(`In-Reply-To: ${latestMessageId}`);
        headers.push(`References: ${latestMessageId}`);
    }
    // 3. Assemble the raw email content
    const emailContent = `${headers.join('\r\n')}\r\n\r\n${body}`;
    // 4. Base64url encode the raw message
    const raw = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    // 5. Send message via Gmail API
    const response = yield gmail_1.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw,
            threadId
        }
    });
    return response.data;
});
exports.GmailService = {
    getInboxThreads,
    getEmailHistory,
    sendReply
};
