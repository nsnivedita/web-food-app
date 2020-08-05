/* eslint-disable no-unused-expressions */
import React, { useState} from "react";
import ItemDataService from "../../../Services/item.service";
import TransferList from "./map";

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

const ListGroupItem = () => {
  const [data, setData] = React.useState([]);
  const [activeTab, setActiveTab] = useState(1);

  React.useEffect(() => {
    ItemDataService.getAllMenu()
    .then((response) => {
      setData(response.data.response);
    })
    .catch((e) => {
      console.log(e);
    });
},[]);

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs="3" className="nav-head">
                  <CNav fill variant="pills">
                    <CNavLink active className="nav-item">
                      Group
                    </CNavLink>
                  </CNav>
                  <br />
                </CCol>
                <CCol xs="9" className="nav-head">
                  <CNav fill variant="pills">
                    <CNavLink active className="nav-item">
                      Group Item Mapping
                    </CNavLink>
                  </CNav>
                </CCol>
              </CRow>

              <CRow>
                <CCol xs="3" style={{ height: "400px", overflow: "scroll" }}>
                  {data.map((group) => {
                    return (
                      <CListGroup key={group.id} id="list-tab" role="tablist">
                        <CListGroupItem
                          onClick={() => setActiveTab(group.id)}
                          action
                          active={activeTab === group.id}
                        >
                          {group.name}
                        </CListGroupItem>
                      </CListGroup>
                    );
                  })}
                </CCol>

                <CCol xs="9">
                  <CCard color="secondary">
                    <CTabContent className="tab-contents">
                      {data.map((group) => {
                        return (
                          <CTabPane
                            key={group.id}
                            active={activeTab === group.id}
                          >
                            <TransferList
                              key={group.id}
                              ItemList={group.itemList}
                              id={group.id}
                              name={group.name}
                            />
                          </CTabPane>
                        );
                      })}
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

export default ListGroupItem;
