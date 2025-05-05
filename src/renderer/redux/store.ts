import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './o-notesSlice';

export const store = configureStore({
  reducer: {
    onotes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;