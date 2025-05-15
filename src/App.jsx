import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicRoutes from "./router/routes";
import Admin from "./pages/admin/admin";
import ReportedPosts from "./pages/admin/ReportedPosts";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {PublicRoutes.map((route, index) => (
          <Route 
            key={index} 
            path={route.path} 
            element={<route.component />} 
          />
        ))}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<ReportedPosts />} />
          <Route path="reported-posts" element={<ReportedPosts />} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
