import React from 'react'
import Header from '../../components/header/header'
import LeftSidebar from '../../components/sidebar/leftsidebar'
import RightSidebar from '../../components/sidebar/rightsidebar'

import {
  PhotoLibrary
} from "@mui/icons-material";

function home() {

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <LeftSidebar />

        <div className="content-area">
          <div style={{width:'70%'}}>

            <div style={{width:'100%', backgroundColor:'white', borderRadius:'10px'}}>
              <div  className="container-question">
                <img src="./src/assets/4.jpg" style={{width:'45px', height:'45px', borderRadius:'50%'}}/>
                <span className="text-area">
                    Hoài Nam ơi, bạn đang nghĩ gì thế?
                </span>
              </div>
              
              <div className="div-anh-video"> 
                  <div style={{color:'green', fontSize:'large', marginRight:'5px'}}><PhotoLibrary/></div>
                  <span>Ảnh/Video</span>
              </div>
            </div>
          </div>
        </div>

        <RightSidebar/>
      </div>
    </div>
  )

}

export default home
