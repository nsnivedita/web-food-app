import React, { useState } from "react";
import ItemDataService from "../../../Services/item.service";
import AddModifiers from "./addModifier";

import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CCollapse,
  CListGroupItem,
} from "@coreui/react";

export default function ModifiersList(props) {
  const [data, setData] = useState([]);
  const initialValues = {
    name: "",
    itemId: props.id,
    status: "",
    ruleId:'',
    r1:'',

    options: [
      {
        id:"",
        name: "",
        price: 0.0,
        modifierId:'',
        status: "A",
      },
    ]
  };


  React.useEffect(() => {
    
    ItemDataService.getModifier(props.id)
      .then((res) => {
        setData(res.data);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [accordion, setAccordion] = useState(0);

  const getStatus = (status) => {
    if(status==='A' || status==='Available'){
      return 'Active'
    }else return 'Not Active'
  };
  
  
  
  return (
    <>
      <CRow>
        <CCol lg="5">
          {data.map((modifiers) => (
            <CCard key={modifiers.id} className="mb-2 p-0 c-active-modifier" style={{ marginTop: "10px" }}>
              <CListGroupItem
                color="gray"
                className=" m-0 p-1 modifier-btn c-active"
                onClick={() => (
                  setAccordion(
                    accordion === modifiers.id ? null : modifiers.id
                  )
                  
                )}
                action
                active={accordion===modifiers.id}
              >
                <span
                  className=" m-0 p-1"
                  style={{ float: "left", fontSize: "14px" }}
                >
                 <span style={{minWidth:'140 px'}}>{modifiers.name}</span>  <span shape="pill" >
                    {getStatus(modifiers.status)}
                  </span>
                </span>
                <span style={{ float: "right", fontSize: "16px" }}>
                  <i className="fa fa-chevron-circle-down"></i>
                </span>
              </CListGroupItem>

              <CCollapse show={accordion === modifiers.id}  >
                {modifiers.options.map((option) => (
                  <CCardHeader key={option.id}>
                    <div  style={{ border: "1px solid gray", padding: "8px" }}>
                      <span style={{ textAlign: "left" }}>{option.name}</span>{" "}
                      <span style={{ float: "right" }}>R{option.price}</span>
                    </div>
                  </CCardHeader>
                ))}
              </CCollapse>
            </CCard>
          ))}
        <CButton
            color="success"
            className="p-2 mt-2"
            onClick={() => setAccordion(
              accordion === props.id ? null : props.id
            )}
          >
            
            Add New
          </CButton>
        
        </CCol>
        <CCol lg="7">
          {data.map((modifiers) => (
            <CCollapse key={modifiers.id} show={accordion === modifiers.id}>
              <AddModifiers Id={modifiers.id} modifiers={modifiers} />
            </CCollapse>
          ))}
          <CCollapse show={accordion === props.id}>
            <AddModifiers id={props.id} modifiers={initialValues} />
          </CCollapse>
         </CCol>
      </CRow>
    </>
  );
}
