import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "./Slices/pollSlice.js"; // Import the pollSlice reducer

const store = configureStore({
  reducer: {
    poll: pollReducer, // Add the poll slice reducer to the store
  },
});

export default store;
