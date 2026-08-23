"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const mongoose_1 = require("mongoose");
const StateSchema = new mongoose_1.Schema({
    state: { type: String, required: true, unique: true },
    zip: { type: String, required: false },
    type: { type: String, required: true }
}, {
    timestamps: true
});
exports.State = (0, mongoose_1.model)("State", StateSchema);
