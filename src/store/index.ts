import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './reducers/eventsReducer';
import labelsReducer from './reducers/labelsReducer';
import countriesCodeReducer from './reducers/countriesCodeReducer';
import holidaysReducer from './reducers/holidaysReducer';
import currentDateReducer from './reducers/currentDateReducer';


export const store = configureStore({
    reducer: {
        events: eventsReducer,
        labels: labelsReducer,
        countriesCode: countriesCodeReducer,
        holidays: holidaysReducer,
        currentDate: currentDateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
