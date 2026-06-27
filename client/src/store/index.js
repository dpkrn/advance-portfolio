import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import sectionsReducer from './slices/sectionsSlice';
import uiReducer from './slices/uiSlice';
import adminAuthReducer from './slices/adminAuthSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    sections: sectionsReducer,
    ui: uiReducer,
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
