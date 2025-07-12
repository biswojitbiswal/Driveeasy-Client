import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import carReducer from '../features/car/carSlice'
import bookingReducer from '../features/booking/bookingSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carReducer,
        bookings: bookingReducer
    }
})