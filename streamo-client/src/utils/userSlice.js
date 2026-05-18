import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    channelData: null, // Holds the current dynamic channel document instance
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
    },
    setChannel: (state, action) => {
      state.channelData = action.payload;
      if (state.userData) {
        state.userData.hasChannel = true; 
        localStorage.setItem("user", JSON.stringify(state.userData));
      }
    },
    removeChannelState: (state) => {
      state.channelData = null;
      if (state.userData) {
        state.userData.hasChannel = false;
        localStorage.setItem("user", JSON.stringify(state.userData));
      }
    },
    removeUser: (state) => {
      state.userData = null;
      state.token = null;
      state.channelData = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { addUser, setChannel, removeChannelState, removeUser } = userSlice.actions;
export default userSlice.reducer;