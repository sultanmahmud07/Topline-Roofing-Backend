import { QueryBuilder } from "../../utils/QueryBuilder";
import { IState } from "./state.interface";
import { State } from "./state.model";

const createState = async (payload: IState) => {
    const existingState = await State.findOne({ state: payload.state });
    if (existingState) {
        throw new Error(`A state with the name ${payload.state} already exists.`);
    }

    const result = await State.create(payload);
    return result;
};

const getAllStates = async (query: Record<string, string>) => {
    const searchableFields = ['state', 'zip', 'type'];
    const queryBuilder = new QueryBuilder(State.find(), query);

    const stateQuery = await queryBuilder
        .search(searchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        stateQuery.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
};

const getSingleState = async (id: string) => {
    const result = await State.findById(id);
    if (!result) throw new Error("State not found.");
    return result;
};

const updateState = async (id: string, payload: Partial<IState>) => {
    const existingState = await State.findById(id);
    if (!existingState) {
        throw new Error("State not found.");
    }

    if (payload.state && payload.state !== existingState.state) {
        const duplicateState = await State.findOne({ state: payload.state });
        if (duplicateState) {
            throw new Error(`The state name ${payload.state} is already taken.`);
        }
    }

    const result = await State.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });

    return result;
};

const deleteState = async (id: string) => {
    const result = await State.findByIdAndDelete(id);
    if (!result) throw new Error("State not found.");
    return null;
};

export const StateService = {
    createState,
    getAllStates,
    getSingleState,
    updateState,
    deleteState
};
