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
exports.StateService = void 0;
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const state_model_1 = require("./state.model");
const createState = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingState = yield state_model_1.State.findOne({ state: payload.state });
    if (existingState) {
        throw new Error(`A state with the name ${payload.state} already exists.`);
    }
    const result = yield state_model_1.State.create(payload);
    return result;
});
const getAllStates = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['state', 'zip', 'type'];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(state_model_1.State.find(), query);
    const stateQuery = yield queryBuilder
        .search(searchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        stateQuery.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleState = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield state_model_1.State.findById(id);
    if (!result)
        throw new Error("State not found.");
    return result;
});
const updateState = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingState = yield state_model_1.State.findById(id);
    if (!existingState) {
        throw new Error("State not found.");
    }
    if (payload.state && payload.state !== existingState.state) {
        const duplicateState = yield state_model_1.State.findOne({ state: payload.state });
        if (duplicateState) {
            throw new Error(`The state name ${payload.state} is already taken.`);
        }
    }
    const result = yield state_model_1.State.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return result;
});
const deleteState = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield state_model_1.State.findByIdAndDelete(id);
    if (!result)
        throw new Error("State not found.");
    return null;
});
exports.StateService = {
    createState,
    getAllStates,
    getSingleState,
    updateState,
    deleteState
};
