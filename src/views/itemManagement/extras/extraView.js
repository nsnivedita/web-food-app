/* eslint-disable no-sequences */
/* eslint-disable default-case */
import React, { useState} from 'react'
import ItemDataService from '../../../Services/item.service'
import Modal from "react-bootstrap/Modal";
import ExtraForm from './extraForm'
import {CSVLink} from 'react-csv';
import { useSelector, useDispatch } from "react-redux";
import ConfirmDialog from "../../../components/dialog";



import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CImg


} from '@coreui/react'




const getBadge = (status) => {
  if(status==='A' || status==='Available'){
    return 'success'
  }else return 'danger'
}

const getStatus = (status) => {
  if(status==='A' || status==='Available'){
    return 'Available'
  }else return 'Not Available'
};


const Extra = () => {
  

  const initialState = {
    id:'',
    name: '',
    description: '',
    image: '',
    status:'',
    price:0.0,
    uuid:'',
   
  }
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch()
  const toasterShow = useSelector(state => state.toast.toasterShow)
  const [show, setShow] = useState(false);
  const [CurrentItem,setCurrentItem]=useState(initialState);

  const handleClose = () => (setShow(false),setCurrentItem(null));
  const handleShow = (item) => setShow(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [Id, setId] = useState(0);
  
  React.useEffect(() => {
    ItemDataService.getAllExtra()
    .then((response) => {
      setData(response.data);
    })
    .catch((e) => {
      console.log(e);
    })},[]);
  
  const item = 
  data.map((data)=>{
    return{
      id:data.id,
      name:data.name,
         description:data.description,
         price:data.price,
         status:data.status,
         image:data.image,
         uuid:data.uuid
        
         
    }})

    
   
    
    const refresh =()=>{
      setData([]);
        (async () => {
          const users = await ItemDataService.getAllExtra();
          setData(users.data);
        })();
    }
  
    const renderToaster=(message,color)=>{
      refresh();
     
      dispatch({type: 'set', toast: {
        toasterShow:!toasterShow,
          toasterMessage:message,
          toasterColor:color
      }})
  
    }

    const  deleteItem=(id)=> {
        ItemDataService.deleteExtra(Id)
          .then(response => {
           // console.log(response.data);
            this.setState({
    
              items: data.filter(item => item.id !== Id)
            });
          })
          .catch(e => {
            console.log(e);
          });
      }
     
    const fields = [
      { key: 'image', _style: { width: '10%'} },
      { key: 'name', _style: { width: '20%'} },
      'description',
      { key: 'price', _style: { width: '15%'} },
      { key: 'status', _style: { width: '15%'} },
      
      {
        key: 'show_details',
        label: 'action',
        _style: { width: '10%' },
        sorter: false,
        filter: false
      }
    ]
   // console.log(item)

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
              style={{ float: 'right', margin: '8px' }}
            >
            <i className="fa fa-download" aria-hidden="true"></i>
          </CSVLink>
            <CButton type="submit" className="btn btn-success add-btn" onClick={handleShow} style={{ float: 'right', margin: '8px' }}>Add Extras</CButton>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton style={{backgroundColor:'#ebedef'}}>
              <Modal.Title>Extras</Modal.Title>
            </Modal.Header>
            <Modal.Body><ExtraForm CurrentExtra={CurrentItem} onHide={handleClose} toast={renderToaster}/></Modal.Body>
          </Modal>
          
          <CDataTable
              items={item}
              fields={fields}
            tableFilter
              header
              itemsPerPage={7}
              hover
              sorter
              pagination
              scopedSlots = {{
                'image':
                item=>{
                  return(
                    <td className="py-2">
                      <CImg src={item.image} style={{width:'30px',height:'20px'}}/>
                    </td>
  
                  )
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
  
                'status':
                  (item)=>(
                    
                    <td>
                    <CBadge color={getBadge(item.status)}>
                      {getStatus(item.status)}
                    </CBadge>
                  </td>
    
                    
                  ),
                'show_details':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                    <i className="fa fa-edit" onClick={()=>(setCurrentItem(item),handleShow(item))}  style={{ fontSize: '20px' }}></i>&nbsp;&nbsp;
                                
                    <i className="fa fa-trash"  onClick={() => (setId(item.id), setConfirmOpen(true))} aria-hidden="true" style={{ fontSize: '20px',marginLeft:'15px',color:'#e55353' }}></i> 

                      </td>
                      )
                  },
                
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


              
  )
}

export default Extra







