

const initialState ={
  
    sidebarShow:'responsive',
    asideShow: false,
    darkMode: false,
   toast:{
    toasterShow:false,
    toasterMessage:'',
    toasterColor:''
   }
    
  }
  
  export const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
      case 'set':
        return {...state, ...rest }
      default:
        return state
    }
  }