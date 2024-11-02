import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./features/JobSlice";
const store = configureStore({
  reducer: {
    jobs: jobReducer,
  },
});

export default store;
