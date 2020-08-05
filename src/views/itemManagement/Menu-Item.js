import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Items from "./item/itemView";
import Group from "./group/groupView";
import ListGroupItem from "./group-itemMap/groupItemView";
import Extra from "./extras/extraView";
import ItemModifiers from "./Modifiers/modifiersView";

export { ListGroupItem, Items, Group, Extra, ItemModifiers };

export default function ControlledTabs() {
  const [key, setKey] = React.useState("home");

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="home" title="Group">
          <Group />
        </Tab>
        <Tab eventKey="item" title="Item">
          <Items />
        </Tab>

        <Tab eventKey="extra" title="Extra">
          <Extra />
        </Tab>
        <Tab eventKey="profile" title="Group-Item">
          <ListGroupItem />
        </Tab>
        <Tab eventKey="Modifiers" title="Modifiers">
          <ItemModifiers />
        </Tab>
      </Tabs>
    </>
  );
}
