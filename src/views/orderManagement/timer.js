import React from "react";
import {
  CAlert,
  
  CBadge,
} from "@coreui/react";
//import { render } from "enzyme";

const Alerts = (props) => {
  const [visible, setVisible] = React.useState(60);
  
  const getStatus = (visible) => {
    if (visible<=20){
        return 'danger'

    }else if (visible<=40){
        return 'warning'
    }else {
        return 'success'
    }
  };
  
  /*const getColor = (visible) => {
    if (visible<=20){
        return 'red'

    }else if (visible<=40){
        return 'yellow'
    }else {
        return 'green'
    }
  };*/
 const render=(visible)=>{
    if(visible!==0){return(
        <CAlert  show={visible} onShowChange={setVisible}>
          
          {visible}<CBadge color={getStatus(visible)}>Status </CBadge>
        </CAlert>)}
        else{return(
        <CAlert color="danger">Expired</CAlert>)}
  }
  
 
  return (
    <>
    {render(visible)}
    </>
  );
};

export default Alerts;
