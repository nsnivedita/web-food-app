/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import React, { useState } from "react";
import ItemDataService from "../../../Services/item.service";
import ModifiersList from "./modifiers";

import {
  CCard,
  CNav,
  CCardBody,
  CNavLink,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react";

const ItemModifiers = () => {
  const [data, setData] = React.useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [Id, setId] = useState(1);

  React.useEffect(() => {
    ItemDataService.getAll().then((res) => {
      setData(res.data);
    });
  }, []);

  const modifierCount = (count)=>{
    if(count>0){return(
    <span style={{float:'right'}}>{count}</span>)
    }
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs="3" className="nav-head ">
                  <CNav fill variant="pills">
                    <CNavLink active className="nav-item p-2">
                      Item
                    </CNavLink>
                  </CNav>
                  <br />
                </CCol>
                <CCol xs="9" className="nav-head">
                  <CNav fill variant="pills">
                    <CNavLink active className="nav-item p-2">
                      Modifiers
                    </CNavLink>
                  </CNav>
                </CCol>
              </CRow>

              <CRow>
                <CCol xs="3" className='scrollBar' >
                  {data.map((item) => {
                    return (
                      <CListGroup key={item.id} id="list-tab" role="tablist">
                        <CListGroupItem
                          onClick={() => (
                            setActiveTab(item.id), setId(item.id)
                          )}
                          action
                          active={activeTab === item.id}
                        >
                          {item.name}
                         {modifierCount(item.modifiers.map((m)=>m.name).length)}
                        </CListGroupItem>
                      </CListGroup>
                    );
                  })}
                </CCol>

                <CCol xs="9">
                  <CCard color="secondary" style={{ minHeight: "400px" }}>
                    <CTabContent className="tab-contents">
                      <CTabPane key={Id} active={activeTab === Id}>
                        <ModifiersList id={Id} />
                      </CTabPane>
                    </CTabContent>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ItemModifiers;
