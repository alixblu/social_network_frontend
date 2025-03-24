import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/header/header.jsx';
import LeftSidebar from './components/sidebar/leftsidebar.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-container">
      <Header />
      <div className="main-content">
        <LeftSidebar />
        <div className="content-area">
          {/* Nội dung chính ở đây */}
        </div>
      </div>
    </div>
  </StrictMode>
);
