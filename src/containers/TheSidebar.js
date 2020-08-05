/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import { useFetch } from "./_nav";
import CIcon from "@coreui/icons-react";


const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  const [data] = useFetch(
    "https://xgileit-channel-service.herokuapp.com/api/v1/navmenu"
  );
  //const {item} = data.map({item});
  var item = data.map((data) => {
    if (data.child == null) {
      return {
        _tag: data.tag,
        name: data.title,
        to: data.url,
        icon: data.icon,
      };
    } else {
      return {
        _tag: data.tag,
        name: data.title,
        to: data.url,
        icon: data.icon,
        _children: data.child.map((data) => {
          return {
            _tag: data.tag,
            name: data.title,
            to: data.url,
            icon: data.icon,
          };
        }),
      };
    }
  });
  
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <h3 className="c-sidebar-brand-full head"><b>FOOD-APP</b></h3>

        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={item}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
