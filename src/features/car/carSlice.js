import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCars, getCarById, getCarStats } from "../../services/apiService";

export const fetchAllCars = createAsyncThunk(
  "cars/fetchAll",
  async (queryParams = {}) => {
    try {
      const response = await getAllCars(queryParams);

      return {
        cars: response.data || [],
        page: response.page,
        total: response.total,
        limit: response.limit,
      };
    } catch (error) {
      console.error("Error in fetchAllCars:", error);
      throw error;
    }
  }
);

export const fetchStats = createAsyncThunk("cars/fetchStats", async () => {
  try {
    const response = await getCarStats();
    console.log(response);
    return {
      activeCars: response.data.activeCars,
      inactiveCars: response.data.inactiveCars,
      avgPrice: response.data.avgPrice,
    };
  } catch (error) {
    console.error("Error in fetchAllCars:", error);
    throw error;
  }
});

export const fetchCarById = createAsyncThunk("cars/fetchById", async (id) => {
  try {
    const response = await getCarById(id);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error in fetchAllCars:", error);
    throw error;
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState: {
    cars: [],
    stats: {},
    car: null,
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCar: (state) => {
      state.car = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";

        state.cars = data.cars || [];
        state.page = data.page || 1;
        state.total = data.total || 0;
        state.limit = data.limit || 10;
        state.totalPages = Math.ceil(state.total / state.limit);
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      })

      .addCase(fetchCarById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.car = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearCar } = carSlice.actions;
export default carSlice.reducer;
