import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  questions: JSON.parse(localStorage.getItem("questions")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const userInfo = action.payload.data.user;
      state.userInfo = userInfo;

      // Save user info and expiration time in local storage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },

    setQuestions: (state, action) => {
      const questions = action.payload;
      state.questions = questions;

      // Save questions in local storage
      localStorage.setItem("questions", JSON.stringify(questions));
    },

    logout: (state) => {
      state.userInfo = null;
      state.questions = null;

      // Clear all relevant data from local storage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("questions");
      localStorage.removeItem("expirationTime");
    },

    checkExpiration: (state) => {
      const expirationTime = localStorage.getItem("expirationTime");
      if (expirationTime && Date.now() > expirationTime) {
        // Clear state and log the user out if time has expired
        state.userInfo = null;
        state.questions = null;
        localStorage.clear();
      }
    },
  },
});

export const { setCredentials, setQuestions, logout, checkExpiration } = authSlice.actions;

export default authSlice.reducer;
