import { createSlice } from '@reduxjs/toolkit';

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    token: storedToken,
    authenticated: !!storedToken,
  },
  reducers: {
    setAdminToken: (state, action) => {
      state.token = action.payload;
      state.authenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('adminToken', action.payload);
      } else {
        localStorage.removeItem('adminToken');
      }
    },
    logout: (state) => {
      state.token = null;
      state.authenticated = false;
      localStorage.removeItem('adminToken');
    },
  },
});

export const { setAdminToken, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

export function selectAdminToken(state) {
  return state.adminAuth.token;
}
