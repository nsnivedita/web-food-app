/* eslint-disable jsx-a11y/anchor-is-valid */


import React from "react";
import OrderService from "../../Services/order.service";
import OrderForm from "./orderForm";
import Modal from "react-bootstrap/Modal";
import OrderDetail from './orderDetail';
import ReactTooltip from "react-tooltip";
import Moment from 'react-moment';

import {
  CCard,
  CCardFooter,
  CNav,
  CCardBody,
  CCardHeader,
  CNavLink,
  CAlert,
  CProgress,
  CCol,
  CRow,
 
} from "@coreui/react";

import Dropdown from "react-bootstrap/Dropdown";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <span className="threedots" />
  </a>
));

const getStatus = (visible) => {
  if (visible <= 40) {
    return "success";
  } else if (visible >= 40 && visible <= 60) {
    return "warning";
  } else {
    return "danger";
  }
};


const getDelivery = (type) => {
  if (type === 1) {
    return "success";
  } else if (type === 2) {
    return "warning";
  } else return "primary";
};

const getColorheader = (type) => {
  if (type === 1) {
    return "#2eb85c47";
  } else if (type === 2) {
    return "#ffc10747";
  } else return "primary";
};

const getDeliverys = (type) => {
  if (type === 1) {
    return "Delivery";
  } else if (type === 2) {
    return "Takeaway";
  } else return "Siting";
};
export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      percentage: 0,
      show: false,
      CurrentOrder: {},
      condition: false,
      date:'2012-04-23T00:00:00.000Z'
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    //const {tasks}  = this.props;
    setInterval(() => {
      let nextPercent = this.state.percentage + 1;

      this.setState({ percentage: nextPercent });
    }, 1000);
    OrderService.getAllorder()
      .then((res) => {
        this.setState({
          tasks: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleClose() {
    this.setState({ show: false });
    this.setState({ CurrentOrder: null });
  }

  handleShow(order) {
    this.setState({ show: true });
  }

 

  onDragStart = (evt) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };
  onDragEnd = (evt, value) => {
    evt.currentTarget.classList.remove("dragged");
  };
  onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };
  onDragLeave = (evt, value) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };
  onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };
  onDrop = (evt, value) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let data = evt.dataTransfer.getData("text/plain");
    let tasks = this.state.tasks;
    let updated = tasks.map((task) => {
      if (task.id === data) task.statusId = value;

      return task;
    });

    OrderService.updateOrderStatus(data, value).then((res) => console.log(res));
    this.setState({ tasks: updated });
  };


  renderBar(visible) {
    if (visible <= 100) {
      return (
        <CRow>
          <CCol md="3" style={{ fontSize: "12px", padding: "0" }}>
            {this.state.percentage}
          </CCol>
          <CCol md="8">
            <CProgress
              size="xs"
              color={getStatus(this.state.percentage)}
              value={this.state.percentage}
              className="mt-2"
            />
          </CCol>
        </CRow>
      );
    } else {
      return <CAlert color="danger">Expired</CAlert>;
    }
  }

  render() {
    const { tasks } = this.state;

    let accepted = tasks.filter((t) => t.statusId === 1);
    let inprogress = tasks.filter((t) => t.statusId === 2);
    let ready = tasks.filter((t) => t.statusId === 3);
    let deliver = tasks.filter((t) => t.statusId === 4);
    return (
      <div className="Task" >
        <CRow>
          <CCol lg='3'>
          
          <div
            className="pending small-box"
            onDragLeave={(e) => this.onDragLeave(e)}
            onDragEnter={(e) => this.onDragEnter(e)}
            onDragEnd={(e) => this.onDragEnd(e)}
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e, 1)}
            
          >
            <h4 className="nav-head">
              <CNav fill variant="pills">
                <CNavLink active className="nav-item">
                  New Order
                </CNavLink>
              </CNav>
            </h4>
            {accepted.map((task) => (
              <div key={task.id}>
               <div
               data-for={task.orderCode}
               data-tip
               
             >
              <CCard
              borderColor={getDelivery(task.orderType)}
                className="task"
                key={task.id}
                id={task.id}
                draggable
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onClick={() => this.setState({ CurrentOrder: task })}
                onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
              >
                <CCardHeader className="task-head" style={{backgroundColor:getColorheader(task.orderType)}}>
                  <CRow>
                    <CCol lg="5"> {task.orderCode}</CCol>
                    <CCol lg="5">{getDeliverys(task.orderType)}</CCol>
                    <CCol lg="2">
                      <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu size="sm" title="">
                          <Dropdown.Header>Options</Dropdown.Header>
                          <Dropdown.Item
                            onClick={() => this.setState({ show: true })}
                          >
                            Edit/Detail
                          </Dropdown.Item>
                          <Dropdown.Item>Print</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
            <Moment format="YYYY/MM/DD HH:mm">{task.placedTime}</Moment>
                  {task.itemList.map((list) => (
                    <b>{list.itemName}</b>
                  ))}
                </CCardBody>
                <CCardFooter>
                  {this.renderBar(this.state.percentage)}
                </CCardFooter>
              </CCard>
              
              </div>
              <ReactTooltip
              id={task.orderCode}
              key={task.id}
              place='right'
              type='success'
              effect='float'
            >
              
                <OrderDetail task={task} key={task.id}/>
              
              </ReactTooltip>
            </div>
            ))}
          </div>
          
          
          </CCol>
          <CCol lg='3'>
          <div
            className="done small-box"
            onDragLeave={(e) => this.onDragLeave(e)}
            onDragEnter={(e) => this.onDragEnter(e)}
            onDragEnd={(e) => this.onDragEnd(e)}
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e, 2)}
          >
            <h4 className="nav-head">
              <CNav fill variant="pills">
                <CNavLink active className="nav-item">
                  In Progress
                </CNavLink>
              </CNav>
            </h4>

            {inprogress.map((task) => (
             <div key={task.id}>
             <div
             data-for={task.orderCode}
             data-tip
             
           >
            <CCard
            borderColor={getDelivery(task.orderType)}
              className="task"
              key={task.id}
              id={task.id}
              draggable
              onDragStart={(e) => this.onDragStart(e)}
              onDragEnd={(e) => this.onDragEnd(e)}
              onClick={() => this.setState({ CurrentOrder: task })}
              onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
            >
              <CCardHeader className="task-head" style={{backgroundColor:getColorheader(task.orderType)}}>
                <CRow>
                  <CCol lg="5"> {task.orderCode}</CCol>
                  <CCol lg="5">{getDeliverys(task.orderType)}</CCol>
                  <CCol lg="2">
                    <Dropdown>
                      <Dropdown.Toggle as={CustomToggle} />
                      <Dropdown.Menu size="sm" title="">
                        <Dropdown.Header>Options</Dropdown.Header>
                        <Dropdown.Item
                          onClick={() => this.setState({ show: true })}
                        >
                          Edit/Detail
                        </Dropdown.Item>
                        <Dropdown.Item>Print</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                {task.itemList.map((list) => (
                  <>{list.itemName}</>
                ))}
              </CCardBody>
              <CCardFooter>
                {this.renderBar(this.state.percentage)}
              </CCardFooter>
            </CCard>
            
            </div>
            <ReactTooltip
            id={task.orderCode}
            key={task.id}
            place='right'
            type='success'
            effect='float'
          >
            
              <OrderDetail task={task} key={task.id}/>
            
            </ReactTooltip>
          </div>
           ))}
          </div>
         
          </CCol>
          <CCol lg='3'>
          <div
            className="done small-box"
            onDragLeave={(e) => this.onDragLeave(e)}
            onDragEnter={(e) => this.onDragEnter(e)}
            onDragEnd={(e) => this.onDragEnd(e)}
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e, 3)}
          >
            <h4 className="nav-head">
              <CNav fill variant="pills">
                <CNavLink active className="nav-item">
                  Ready
                </CNavLink>
              </CNav>
            </h4>
            {ready.map((task) => (
            <div key={task.id}>
            <div
            data-for={task.orderCode}
            data-tip
            
          >
           <CCard
           borderColor={getDelivery(task.orderType)}
             className="task"
             key={task.id}
             id={task.id}
             draggable
             onDragStart={(e) => this.onDragStart(e)}
             onDragEnd={(e) => this.onDragEnd(e)}
             onClick={() => this.setState({ CurrentOrder: task })}
             onMouseEnter={this.handleMouseHover}
       onMouseLeave={this.handleMouseHover}
           >
             <CCardHeader className="task-head" style={{backgroundColor:getColorheader(task.orderType)}}>
               <CRow>
                 <CCol lg="5"> {task.orderCode}</CCol>
                 <CCol lg="5">{getDeliverys(task.orderType)}</CCol>
                 <CCol lg="2">
                   <Dropdown>
                     <Dropdown.Toggle as={CustomToggle} />
                     <Dropdown.Menu size="sm" title="">
                       <Dropdown.Header>Options</Dropdown.Header>
                       <Dropdown.Item
                         onClick={() => this.setState({ show: true })}
                       >
                         Edit/Detail
                       </Dropdown.Item>
                       <Dropdown.Item>Print</Dropdown.Item>
                     </Dropdown.Menu>
                   </Dropdown>
                 </CCol>
               </CRow>
             </CCardHeader>
             <CCardBody>
               {task.itemList.map((list) => (
                 <>{list.itemName}</>
               ))}
             </CCardBody>
             <CCardFooter>
               {this.renderBar(this.state.percentage)}
             </CCardFooter>
           </CCard>
           
           </div>
           <ReactTooltip
           id={task.orderCode}
           key={task.id}
           place='right'
           type='success'
           effect='float'
         >
           
             <OrderDetail task={task} key={task.id}/>
           
           </ReactTooltip>
         </div>
         ))}
          </div>

        
          </CCol>
          <CCol lg='3'>
          <div
            className="done small-box"
            onDragLeave={(e) => this.onDragLeave(e)}
            onDragEnter={(e) => this.onDragEnter(e)}
            onDragEnd={(e) => this.onDragEnd(e)}
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e, 4)}
          >
            <h4 className="nav-head">
              <CNav fill variant="pills">
                <CNavLink active className="nav-item">
                  Dispatched
                </CNavLink>
              </CNav>
            </h4>
            {deliver.map((task) => (
              <div key={task.id}>
              <div
              data-for={task.orderCode}
              data-tip
              
            >
             <CCard
             borderColor={getDelivery(task.orderType)}
               className="task"
               key={task.id}
               id={task.id}
               draggable
               onDragStart={(e) => this.onDragStart(e)}
               onDragEnd={(e) => this.onDragEnd(e)}
               onClick={() => this.setState({ CurrentOrder: task })}
               onMouseEnter={this.handleMouseHover}
         onMouseLeave={this.handleMouseHover}
             >
               <CCardHeader className="task-head" style={{backgroundColor:getColorheader(task.orderType)}}>
                 <CRow>
                   <CCol lg="5"> {task.orderCode}</CCol>
                   <CCol lg="5">{getDeliverys(task.orderType)}</CCol>
                   <CCol lg="2">
                     <Dropdown>
                       <Dropdown.Toggle as={CustomToggle} />
                       <Dropdown.Menu size="sm" title="">
                         <Dropdown.Header>Options</Dropdown.Header>
                         <Dropdown.Item
                           onClick={() => this.setState({ show: true })}
                         >
                           Edit/Detail
                         </Dropdown.Item>
                         <Dropdown.Item>Print</Dropdown.Item>
                       </Dropdown.Menu>
                     </Dropdown>
                   </CCol>
                 </CRow>
               </CCardHeader>
               <CCardBody>
                 {task.itemList.map((list) => (
                   <>{list.itemName}</>
                 ))}
               </CCardBody>
               <CCardFooter>
                 {this.renderBar(this.state.percentage)}
               </CCardFooter>
             </CCard>
             
             </div>
             <ReactTooltip
             id={task.orderCode}
             key={task.id}
             place='right'
             type='success'
             effect='float'
           >
             
               <OrderDetail task={task} key={task.id}/>
             
             </ReactTooltip>
           </div>
          ))}
          </div>
       
          </CCol>
        </CRow>

        
          
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton style={{ backgroundColor: "#ebedef" }}>
            <Modal.Title>Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OrderForm
              order={this.state.CurrentOrder}
              onHide={this.handleClose}
            />
          </Modal.Body>
        </Modal>

      </div>
    );
  }
}
