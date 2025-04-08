import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRoutes from './router/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes.map((route, index) => (
          <Route 
            key={index} 
            path={route.path} 
            element={<route.component />} 
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
