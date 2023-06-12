import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {API_AVAILABLE_COUNTRIES, API_CHECK_IP} from "../../services/constants";
import {CountryCode, StateRequests} from "../../services/types";

export const fetchCountriesCode = createAsyncThunk("countriesCode/fetchCountriesCode",
    async () => {
        try {
            const response = await axios.get(`${API_AVAILABLE_COUNTRIES}`);
            const countries = response.data;
            const { data } = await axios.get(API_CHECK_IP);
            const returnData = {
                countriesCode: countries,
                currentCountryCode: null
            }

            if (countries.some((item: CountryCode) => item.countryCode === data.countryCode)) {
                returnData.currentCountryCode = data.countryCode;
            } else {
                returnData.currentCountryCode = countries[0];
            }

            return returnData;
        } catch (error: any) {
            throw new Error(error.message);
        }
    });


interface initialState extends StateRequests {
    countriesCode: CountryCode[],
    countryCode: string | null,
}

const initialState: initialState = {
    countriesCode: [],
    countryCode: null,
    loading: false,
    error: null,
};

const countriesCodeSlice = createSlice({
    name: "countriesCode",
    initialState,
    reducers: {
        updateCountryCode: (state, action: PayloadAction<string>) => {
            state.countryCode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountriesCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountriesCode.fulfilled, (state, action) => {
                state.countriesCode = action.payload.countriesCode
                state.countryCode = action.payload.currentCountryCode
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCountriesCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Something went wrong";
            });
    },
});


export const { updateCountryCode } = countriesCodeSlice.actions;

export default countriesCodeSlice.reducer;
