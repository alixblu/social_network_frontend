import React from 'react'
import Header from '../../components/header/header'
import LeftSidebar from '../../components/sidebar/leftsidebar'
import RightSidebar from '../../components/sidebar/rightsidebar'
import Content from '../../components/content/contentArea'
import {
  PhotoLibrary,
  Clear,Recommend, FavoriteBorder,ModeComment,Send
} from "@mui/icons-material";



function home() {
  
  return (
    <div className="app-container ">
      <Header />
      <div className="w-full main-content">
        <div className='max-w-[30%]'>
          <LeftSidebar />
        </div>
        <div className='h-auto mx-auto flex justify-center'>
          <Content/>
        </div>
        <RightSidebar/>
      </div>
    </div>
  )

}

export default home
