import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_NEXT_PUBLIC_HOLIDAYS} from "../../services/constants";
import {Holiday, StateRequests} from "../../services/types";

export const fetchHolidays = createAsyncThunk("holiday/fetchHolidays",
    async (propsDate: { year: string, countryCode: string }) => {
    try {
        const {year, countryCode} = propsDate;
        const { data } =  await axios.get(`${API_NEXT_PUBLIC_HOLIDAYS}${year}/${countryCode}`);
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
});

interface initialState extends StateRequests {
    holidays: Holiday[]
}

const initialState: initialState = {
    holidays: [],
    loading: false,
    error: null,
};

const holidaySlice = createSlice({
    name: "holiday",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidays.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.holidays = [...action.payload];
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Something went wrong";
            });
    },
});


export default holidaySlice.reducer;
