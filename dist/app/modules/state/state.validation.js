"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStateSchema = exports.createStateSchema = void 0;
const zod_1 = require("zod");
exports.createStateSchema = zod_1.z.object({
    state: zod_1.z.string().min(1, "State name is required"),
    zip: zod_1.z.string().optional(),
    type: zod_1.z.string().min(1, "Type is required")
});
exports.updateStateSchema = zod_1.z.object({
    state: zod_1.z.string().optional(),
    zip: zod_1.z.string().optional(),
    type: zod_1.z.string().optional()
});
