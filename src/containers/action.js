import axios from 'axios';
import {FETCH_NAV_SUCCESS} from './type';



/*const fetchRentalByIdInit = () => {
  return {
    type: FETCH_NAV_BY_ID_INIT
  }
}


const fetchRentalsInit = () => {
  return {
    type: FETCH_NAV_INIT
  }
}*/
const fetchNavSuccess = (nav) => {
  return {
    type: FETCH_NAV_SUCCESS,
nav
  }
}




/*const fetchRentalByIdSuccess = (rental) => {
  return {
    type: FETCH_NAV_BY_ID_SUCCESS,
    rental
  }
}*/


export const fetchNav = ()=>{

  return dispatch =>{
    axios.get('http://localhost:8001/api/navmenu')
    .then(res=> res.data)
      .then(nav=> dispatch(fetchNavSuccess(nav)));
  }
}



/*export const fetchRentalsById = (rentalId)=>{

 return dispatch=>{
  dispatch(fetchRentalByIdInit());

  axios.get(`/api/v1/rentals/${rentalId}`)
  .then(res=>res.data)
  .then(rental=>dispatch(fetchRentalByIdSuccess(rental)));
  }

  
  
}*/

