import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import coursesSlice from './slices/coursesSlice';
import liveSlice from './slices/liveSlice';

// Create the Redux store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    courses: coursesSlice,
    live: liveSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, courses: CoursesState, live: LiveState}
export type AppDispatch = typeof store.dispatch;

export default store;
