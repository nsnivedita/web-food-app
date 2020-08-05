import React from "react";

//import usersData from './UsersData'

const OrderDetail = (props) => {
  return (
   <>

      {props.task.itemList.map((item) => {
        return (
          <div key={props.task.id}>
             <b>name</b> <span>{item.itemName}</span>
              <b></b><span>-{item.quantity}</span>
              {item.itemOptions.map((Op) => {
                return <span key={Op.name}> options:{Op.name}</span>
              })}
              </div> 
        );
      })}
   </>
  );
};

export default OrderDetail;
