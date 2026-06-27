import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSections = createAsyncThunk('sections/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await api.getSections();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

function sortSections(sections) {
  return [...sections].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.slug || '').localeCompare(b.slug || '');
  });
}

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: {
    items: [],
    loading: false,
    error: null,
    activeSection: 'hero',
  },
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sortSections(action.payload);
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveSection } = sectionsSlice.actions;
export default sectionsSlice.reducer;
