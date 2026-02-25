// store/feedSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      if (!state) return state;
      const removedUserId = action.payload;
      return state.filter((user) => {
        const userId = user?._id || user?.id;
        return userId !== removedUserId;
      });
    },
    removeFeed: () => null,
  },
});

export const { addFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
