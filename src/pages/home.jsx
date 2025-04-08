import React from 'react'
import Header from '../components/header/header'
import LeftSidebar from '../components/sidebar/leftsidebar'
function home() {

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <LeftSidebar />
        <div className="content-area">
        </div>
      </div>
    </div>
  )
}

export default home
