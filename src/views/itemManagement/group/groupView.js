/* eslint-disable no-sequences */
/* eslint-disable no-lone-blocks */
/* eslint-disable default-case */
import React, { useState } from "react";
import ItemDataService from "../../../Services/item.service";
import GroupForm from "./groupForm";
import Modal from "react-bootstrap/Modal";
import { CSVLink } from "react-csv";
import { useSelector, useDispatch } from "react-redux";
import ConfirmDialog from "../../../components/dialog";

import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CSwitch,
  CImg,
  CButton,
} from "@coreui/react";
const fields = [
  { key: "image", _style: { width: "15%" } },

  { key: "name", _style: { width: "15%" } },

  { key: "description", _style: { width: "25%" } },
  { key: "itemCount", label: "No. of Item", _style: { width: "15%" } },

  { key: "status", _style: { width: "15%" } },
  {
    key: "show_details",
    label: "Action",
    _style: { width: "15%" },
    sorter: false,
    filter: false,
  },
];



const getChecked = (status) => {
  return status === "A" || status === "Avilable";
};

const Group = () => {
  const initialState = {
    id: "",
    name: "",
    description: "",
    image: "xyz",
    status: "",
    itemCount: 0,
    selectedFile: null,
    uuid: "",
  };
 

  

  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();
  const toasterShow = useSelector((state) => state.toast.toasterShow);

  React.useEffect(() => {
    ItemDataService.getAllGroup()
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  },[]);

  const group = data.map((data) => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      status: data.status,
      uuid: data.uuid,
      itemCount: data.itemCount,
    };
  });

  const [show, setShow] = useState(false);
  const [CurrentGroup, setCurrentGroup] = useState(initialState);

  const handleClose = () => (setShow(false), setCurrentGroup(null));
  const handleShow = (group) => setShow(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [Id, setId] = useState(0);

  const refresh = () => {
    setData([]);
    (async () => {
      const users = await ItemDataService.getAllGroup();
      setData(users.data);
    })();
  };

  const renderToaster = (message, color) => {
   refresh();
    dispatch({
      type: "set",
      toast: {
        toasterShow: !toasterShow,
        toasterMessage: message,
        toasterColor: color,
      },
    });
  };

  const updateSwitch = (id, status) => {
    (async () => {
      // eslint-disable-next-line no-whitespace-before-property
      await ItemDataService.updateGroupStatus(id, status).then((response) => {
        //defaultChecked={getChecked(item.status)}
        // console.log(response)
        

        console.log(response.status);
        if (response.status === 200) {
          renderToaster("successful", "green");
        }
      }) .catch((e) => {
        renderToaster('Unsuccessful','#e55353')
        console.log(e);
      });;
    })();
  };

  const deleteGroup = () => {
    ItemDataService.deleteGroup(Id)
      .then((response) => {
        setData({
          groups: this.state.groups.filter((group) => group.id !== Id),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardBody>
            <CSVLink
              data={group}
              filename={"my-file.csv"}
              className="btn btn-secondary"
              target="_blank"
              style={{ float: "right", margin: "8px" }}
            >
              <i className="fa fa-download" aria-hidden="true"></i>
            </CSVLink>
            <CButton
              type="submit"
              className="btn btn-success add-btn"
              onClick={handleShow}
              style={{ float: "right", margin: "8px" }}
            >
              Add Group
            </CButton>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton style={{ backgroundColor: "#ebedef" }}>
                <Modal.Title>Extras</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <GroupForm currentGroup={CurrentGroup} onHide={handleClose} toast={renderToaster} />
              </Modal.Body>
            </Modal>

            <CDataTable
              items={group}
              fields={fields}
              // columnFilter
              tableFilter
              header
              // striped

              itemsPerPage={7}
              hover
              sorter
              pagination
              scopedSlots={{
                image: (item) => {
                  return (
                    <td className="py-2">
                      <CImg
                        src={item.image}
                        style={{ width: "30px", height: "20px" }}
                      />
                    </td>
                  );
                },
                description: (item) => {
                  return (
                    <td>
                      <p className="description">{item.description}</p>
                    </td>
                  );
                },
                itemCount: (item) => {
                  return <td>{item.itemCount} item</td>;
                },

                status: (item) => (
                  <td>
                    <CSwitch
                      className={"mx-1"}
                      variant={"3d"}
                      color={"success"}
                      checked={getChecked(item.status)}
                      onChange={(e) =>
                        e.target.checked
                          ? (updateSwitch(item.id, "A"), (e.checked = true))
                          : (updateSwitch(item.id, "NA"), (e.checked = false))
                      }
                      labelOn={"\u2713"}
                      labelOff={"\u2715"}
                    />
                  </td>
                ),
                show_details: (group, index) => {
                  return (
                    <td className="py-2">
                      <i
                        className="fa fa-edit"
                        onClick={() => (
                          setCurrentGroup(group), handleShow(group)
                        )}
                        style={{ fontSize: "20px" }}
                      ></i>
                      &nbsp;&nbsp;
                      <i
                        className="fa fa-trash"
                        onClick={() => (setId(group.id), setConfirmOpen(true))}
                        aria-hidden="true"
                        style={{
                          fontSize: "20px",
                          marginLeft: "15px",
                          color: "#e55353",
                        }}
                      ></i>
                    </td>
                  );
                },
              }}
            />
          </CCardBody>
          <ConfirmDialog
            title="Delete Post?"
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onConfirm={deleteGroup}
          >
            Are you sure you want to delete this post?
          </ConfirmDialog>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default () => (
  <div>
    <Group />
  </div>
);
