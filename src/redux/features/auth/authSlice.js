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

      // Save user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Log the type of expirationDate to understand what we're saving
      // console.log(typeof action.payload.data.user.expirationDate, action.payload.data.user.expirationDate, "expirationDate");

      // Save expiration time based on its type (ISO string or timestamp)
      const expirationTime = action.payload.data.user.expirationDate;
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
      const parsedExpirationTime = Date.parse(expirationTime);

      // Log to debug expiration time
      // console.log(expirationTime, parsedExpirationTime, "expirationTime");

      if (expirationTime && !isNaN(parsedExpirationTime) && Date.now() > parsedExpirationTime) {
        alert("Session expired, logging out...");
        state.userInfo = null;
        state.questions = null;
        localStorage.clear();
      }
    },
  },
});

export const { setCredentials, setQuestions, logout, checkExpiration } = authSlice.actions;

export default authSlice.reducer;
