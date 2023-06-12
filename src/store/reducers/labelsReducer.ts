import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Label } from "../../services/types";


interface initialState  {
    labels: Label[]
}

const initialState: initialState = {
    labels: [],
};

const labelsSlice = createSlice({
    name: "labels",
    initialState,
    reducers: {
        addLabel: (state, action: PayloadAction<Label>) => {
            state.labels = [...state.labels, action.payload]
        },
        updateLabel: (state, action: PayloadAction<Label & { id: number }> ) => {
            state.labels = state.labels.map((label, index) => {
                if(index === action.payload.id) {
                    label.text = action.payload.text
                    label.color = action.payload.color
                }

                return label
            });
        },
        deleteLabel: (state, action: PayloadAction<{id: number}> ) => {
            state.labels = state.labels.filter((label, index) => index !== action.payload.id);
        }
    },
});

export const { addLabel, updateLabel, deleteLabel }  = labelsSlice.actions;

export default labelsSlice.reducer;
