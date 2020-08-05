import {FETCH_NAV_SUCCESS} from '../type';

const INITIAL_STATE ={
    
    nav:{
        data:[]
    }

    
}

export const navReducer = (state= INITIAL_STATE, action)=> {

    switch(action.type){

        case FETCH_NAV_SUCCESS:return{
            ...state,data: action.nav
        }        
        default:
        return state;
    }

}