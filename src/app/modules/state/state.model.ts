import { model, Schema } from "mongoose";
import { IState } from "./state.interface";

const StateSchema = new Schema<IState>({
    state: { type: String, required: true, unique: true },
    zip: { type: String, required: false },
    type: { type: String, required: true }
}, {
    timestamps: true
});

export const State = model<IState>("State", StateSchema);
