import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {

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
