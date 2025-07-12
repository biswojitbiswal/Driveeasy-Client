import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBookings, getBookingById } from "../../services/apiService";

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (queryParams = {}) => {
    try {
      const response = await getBookings(queryParams);

      return {
        bookings: response.data || [],
        page: response.page,
        total: response.total,
        limit: response.limit,
      };
    } catch (error) {
      console.error("Error in fetchAllBookings:", error);
      throw error;
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchById", 
  async (id) => {
    try {
      const response = await getBookingById(id);
      
      // Check if response has a nested structure
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Error in fetchBookingById:", error);
      throw error;
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    booking: null,
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    status: "idle",
    error: null,
  },
  reducers: {
    clearBooking: (state) => {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";

        state.bookings = data.bookings || [];
        state.page = data.page || 1;
        state.total = data.total || 0;
        state.limit = data.limit || 10;
        state.totalPages = Math.ceil(state.total / state.limit);
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchBookingById.pending, (state) => {
        state.status = "loading";
        state.booking = null; // Clear previous booking
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.booking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.booking = null;
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;