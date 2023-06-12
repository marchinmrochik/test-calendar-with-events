import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import moment from 'moment';

interface initialState  {
    currentDate: any;
}

const initialState: initialState = {
    currentDate: moment(),
};

const currentDateSlice = createSlice({
    name: "currentDate",
    initialState,
    reducers: {
        addCurrentDate: (state, action: PayloadAction<{ currentDate: any }>) => {
            state.currentDate = action.payload.currentDate
        },
    },
});

export const { addCurrentDate }  = currentDateSlice.actions;

export default currentDateSlice.reducer;
