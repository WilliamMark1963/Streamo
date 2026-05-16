import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
    },

    setChannel: (state, action) => {
      state.channelData = action.payload;
      if (state.userData) {
        state.userData.hasChannel = true; // Sync the flag
      }
    },
    removeUser: (state) => {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { addUser, setChannel,removeUser, } = userSlice.actions;
export default userSlice.reducer;