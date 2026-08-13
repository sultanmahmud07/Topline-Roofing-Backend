import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GmailService } from "./gmail.service";

const getInboxThreads = catchAsync(async (req: Request, res: Response) => {
    const result = await GmailService.getInboxThreads();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin inbox threads retrieved successfully",
        data: result,
    });
});

const getEmailHistory = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email) {
        throw new Error("Email query parameter is required.");
    }
    const result = await GmailService.getEmailHistory(email as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Email history retrieved successfully",
        data: result,
    });
});

const sendReply = catchAsync(async (req: Request, res: Response) => {
    const result = await GmailService.sendReply(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Reply sent successfully",
        data: result,
    });
});

export const GmailController = {
    getInboxThreads,
    getEmailHistory,
    sendReply
};
