import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import PrivateRoute from "./components/PrivateRoute";
import { checkExpiration } from "./redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();  // Get the current location

  useEffect(() => {
    // Call checkExpiration whenever the route changes
    dispatch(checkExpiration());
  }, [dispatch, location]);

  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="*" element={<PrivateRoute />}>
        <Route path="*" element={<AdminLayout />} />
        
      </Route>
    </Routes>
  );
};

export default App;
