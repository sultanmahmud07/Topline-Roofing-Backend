import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StateService } from "./state.service";

const createState = catchAsync(async (req: Request, res: Response) => {
    const result = await StateService.createState(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "State created successfully",
        data: result,
    });
});

const getAllStates = catchAsync(async (req: Request, res: Response) => {
    const result = await StateService.getAllStates(req.query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "States retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleState = catchAsync(async (req: Request, res: Response) => {
    const result = await StateService.getSingleState(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "State retrieved successfully",
        data: result,
    });
});

const updateState = catchAsync(async (req: Request, res: Response) => {
    const result = await StateService.updateState(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "State updated successfully",
        data: result,
    });
});

const deleteState = catchAsync(async (req: Request, res: Response) => {
    const result = await StateService.deleteState(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "State deleted successfully",
        data: result,
    });
});

export const StateController = {
    createState,
    getAllStates,
    getSingleState,
    updateState,
    deleteState
};
