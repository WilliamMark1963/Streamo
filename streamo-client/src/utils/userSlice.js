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
    removeUser: (state) => {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;