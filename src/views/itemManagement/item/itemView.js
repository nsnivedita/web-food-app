/* eslint-disable no-sequences */
/* eslint-disable default-case */
import React, { useState } from "react";

import ItemDataService from "../../../Services/item.service";
import Modal from "react-bootstrap/Modal";
import ItemForm from "./itemForm";
import { CSVLink } from "react-csv";
import { useSelector, useDispatch} from "react-redux";
import ConfirmDialog from "../../../components/dialog";


import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CSwitch,
  CImg,
  CButton
} from "@coreui/react";



const getChecked = (status) => {
  return status === "A" || status === "Avilable";
};

const Items = () => {
  

  const [data, setData] = React.useState([]);

  const dispatch = useDispatch()
  const toasterShow = useSelector(state => state.toast.toasterShow)

  React.useEffect(() => {
    ItemDataService.getAll()
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
    

  const item = data.map((data) => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      avgTime: data.avgTime,
      status: data.status,
      image: data.image,
      displayOrder: data.displayOrder,
      spicy: data.spicy,
      extra: data.extra,
      dietType:data.dietType,
      uuid:data.uuid
    };
  });

  const initialState = {
    id: "",
    name: "",
    description: "",
    image: "",
    status: "",
    price: 0.0,
    avgTime: "",
    displayOrder: 1,
    uuid:'',
    spicy: null,
   
  }

  const [show, setShow] = useState(false);
  const [CurrentItem, setCurrentItem] = useState(initialState);

  const handleClose = () => (setShow(false), setCurrentItem(null));
  const handleShow = (item) => setShow(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [Id, setId] = useState(0);

  
  const refresh =()=>{
    setData([]);
      (async () => {
        const users = await ItemDataService.getAll();
        setData(users.data);
      })();
  }
  const deleteItem = (id) => {
    ItemDataService.delete(Id)
      .then((response) => {
        console.log(response.data);
        this.setState({
          items: data.filter((item) => item.id !== id),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderToaster=(message,color)=>{
    refresh();
   
    dispatch({type: 'set', toast: {
      toasterShow:!toasterShow,
        toasterMessage:message,
        toasterColor:color
    }})

  }
  


  const updateSwitch = (id, status) => {
    (async () => {
      await ItemDataService.updateItemStatus(id, status).then((response) => {
        //defaultChecked={getChecked(item.status)}
        // console.log(response)
        
        console.log(response.status)
        if(response.status===200){
          renderToaster('successful','green')
        }

      });
    })();
  };
  const fields = [
    { key: "image", _style: { width: "10%" } },
    { key: "name", _style: { width: "20%" } },
    "description",
    { key: "price", _style: { width: "10%" } },
    { key: "displayOrder", label: "Order", _style: { width: "10%" } },
    { key: "status", _style: { width: "10%" } },

    {
      key: "show_details",
      label: "action",
      _style: { width: "10%" },
      sorter: false,
      filter: false,
    },
  ];

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardBody>
            <CSVLink
              data={item}
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
              onClick={() => ( handleShow())}
             
              style={{ float: "right", margin: "8px" }}
            >
              Add Item
            </CButton>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ItemForm CurrentItem={CurrentItem} onHide={handleClose}  toast={renderToaster} />
              </Modal.Body>
            </Modal>

            <CDataTable className='mt-1'
              items={item}
              fields={fields}
              tableFilter
              header
               itemsPerPage={7}
              hover
              sorter
              pagination
              scopedSlots={{
                image: (item) => {
                  return (
                    <td>
                      <CImg
                        src={item.image}
                        style={{ width: "30px", height: "25px" }}
                      />
                    </td>
                  );
                },
                description: (item) => {
                  return (
                    <td>
                      <p className='description'>
                        {(item.description)}
                      </p>
                    </td>
                  );
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
                          ? (updateSwitch(item.id, "A"),
                            (e.checked = true))
                          : (updateSwitch(item.id, "NA"),
                            (e.checked = false))
                      }
                      labelOn={"\u2713"}
                      labelOff={"\u2715"}
                    />
                  </td>
                ),
                show_details: (item, index) => (
                  <td>
                    <i
                      className="fa fa-edit"
                      onClick={() => (setCurrentItem(item), handleShow(item))}
                      style={{ fontSize: "20px" }}
                    ></i>
                    &nbsp;&nbsp;
                    <i
                      className="fa fa-trash"
                      onClick={() => (setId(item.id), setConfirmOpen(true))}
                      aria-hidden="true"
                      style={{
                        fontSize: "20px",
                        marginLeft: "15px",
                        color: "#e55353",
                      }}
                    ></i>
                  </td>
                ),
              }}
            />
          </CCardBody>
          <ConfirmDialog
                        title="Delete Post?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={deleteItem}
                      >
                        Are you sure you want to delete this post?
                      </ConfirmDialog>
        
        </CCard>
      </CCol>
      
    </CRow>
  );
};

export default Items;
