import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {EventI} from "../../services/types";


interface initialState  {
    events: EventI[]
}

const initialState: initialState = {
    events: [],
};

const eventsSlice = createSlice({
    name: "labels",
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<EventI>) => {
            state.events = [...state.events, action.payload]
        },
        removeEvent: (state, action: PayloadAction<{id: number}>) => {
            state.events = state.events.filter((event, index) => index == action.payload.id);
        },
        updateEvent: (state, action: PayloadAction<EventI>) => {
            state.events = state.events.map((item) => (item.id === action.payload.id ? action.payload : item));
        },
    },
});

export const { addEvent, removeEvent, updateEvent }  = eventsSlice.actions;

export default eventsSlice.reducer;
