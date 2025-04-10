import React from 'react'
import "./rightsidebar.css";

import {
    Search
} from "@mui/icons-material";

function rightsidebar() {
  return (
    <div className='right-side-bar'>
        <div className='add-friend-bar'>
            <span>Lời mời kết bạn</span>
            <span style={{marginRight:'5px', cursor:'pointer'}}>Xem tất cả</span>
        </div>

        <div className="thongbao">
            <div className="avarta-add-friend">
                <img src="./src/assets/2.jpg"/>
            </div>
            <div className="confirm-addFriend">

                <div style={{display:'flex', justifyContent:'space-between', margin:'0 0 5px 0'}}>
                    <span>Trần Lê Phương Yên</span>
                    <span>3 ngày</span>
                </div>

                <div style={{display:'flex'}}>
                    <div className='div-btn-acept'>
                        <button>Xác nhận</button>
                    </div>
                    <div className='div-btn-delete'>
                        <button>Xóa</button> 
                    </div>
                        
                </div>
            </div>
        </div>

        <div style={{paddingTop:'10px', borderTop:'#babbbc 1px solid', margin:'0 5px'}}> 
            <div class='contact-bar'> 
                <div> Người liên hệ</div>
                <div><Search/></div>
            </div>

            <div>
                <ul>
                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>


                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>


                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>


                    <li>
                        <div className='div-user-chat'>
                            <div>
                                <img src="./src/assets/1.png" style={{width:'30px', height:'30px', objectFit:'cover', 
                                    borderRadius:'50%', marginRight:'20px'

                                }}/>
                            </div>

                            <div style={{width:'100%'}}>
                                <div style={{width:'100%', alignContent:'center', alignItems:'center'}}>Thành Ân</div>
                            </div>
                        </div>
                    </li>
                    
                            
                </ul>
            </div>
        </div>
    </div>
  )
}

export default rightsidebar