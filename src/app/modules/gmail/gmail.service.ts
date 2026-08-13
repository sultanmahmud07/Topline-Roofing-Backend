/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gmail } from '../../config/gmail';

// Helper to find a specific header value
const getHeader = (headers: any[], name: string): string => {
    const header = headers?.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
};

// Helper to recursively parse and extract the body of a Gmail message
const getMessageBody = (payload: any): { text: string; html: string } => {
    let text = '';
    let html = '';

    if (!payload) return { text, html };

    if (payload.body && payload.body.data) {
        const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        if (payload.mimeType === 'text/plain') {
            text = decoded;
        } else if (payload.mimeType === 'text/html') {
            html = decoded;
        }
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            const parsed = getMessageBody(part);
            if (parsed.text) text += parsed.text;
            if (parsed.html) html += parsed.html;
        }
    }

    return { text, html };
};

// Parse a single message object from Gmail API response
const parseMessage = (msg: any) => {
    const headers = msg.payload?.headers || [];
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
const getInboxThreads = async () => {
    const response = await gmail.users.threads.list({
        userId: 'me',
        q: 'label:INBOX',
        maxResults: 20
    });

    const threads = response.data.threads || [];
    const parsedThreads = await Promise.all(
        threads.map(async (t) => {
            try {
                const threadDetails = await gmail.users.threads.get({
                    userId: 'me',
                    id: t.id!
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
            } catch (err) {
                console.error(`Failed to fetch thread details for ${t.id}:`, err);
                return null;
            }
        })
    );

    return parsedThreads.filter(t => t !== null);
};

/**
 * Fetch all message history for a specific user email
 */
const getEmailHistory = async (email: string) => {
    const response = await gmail.users.threads.list({
        userId: 'me',
        q: `to:${email} OR from:${email}`,
        maxResults: 10
    });

    const threads = response.data.threads || [];
    const parsedHistory = await Promise.all(
        threads.map(async (t) => {
            try {
                const threadDetails = await gmail.users.threads.get({
                    userId: 'me',
                    id: t.id!
                });
                const messages = threadDetails.data.messages || [];
                const parsedMessages = messages.map(msg => parseMessage(msg));

                return {
                    threadId: t.id,
                    subject: parsedMessages[0]?.subject || 'No Subject',
                    messages: parsedMessages
                };
            } catch (err) {
                console.error(`Failed to fetch thread details for user history ${t.id}:`, err);
                return null;
            }
        })
    );

    return parsedHistory.filter(h => h !== null);
};

/**
 * Send a reply email to an existing thread
 */
const sendReply = async (payload: {
    threadId: string;
    to: string;
    subject: string;
    body: string;
}) => {
    const { threadId, to, subject, body } = payload;

    // 1. Fetch the thread to find the latest message details (to thread properly)
    const threadDetails = await gmail.users.threads.get({
        userId: 'me',
        id: threadId
    });
    const messages = threadDetails.data.messages || [];
    if (messages.length === 0) {
        throw new Error('Cannot reply to an empty thread.');
    }

    const latestMessage = messages[messages.length - 1];
    const latestHeaders = latestMessage.payload?.headers || [];
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
    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw,
            threadId
        }
    });

    return response.data;
};

export const GmailService = {
    getInboxThreads,
    getEmailHistory,
    sendReply
};
