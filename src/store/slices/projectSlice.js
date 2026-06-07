import { createSlice } from '@reduxjs/toolkit'

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    category: 'Të gjitha',
    searchQuery: '',
  },
  reducers: {
    setCategory(state, action) {
      state.category = action.payload
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
  },
})

export const { setCategory, setSearchQuery } = projectSlice.actions
export default projectSlice.reducer
