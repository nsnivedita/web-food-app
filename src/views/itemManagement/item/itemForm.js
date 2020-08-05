/* eslint-disable react/no-direct-mutation-state */
import React from "react";
import uploadService from "../../../Services/upload.service";
import ItemDataService from "../../../Services/item.service";
import { connect } from "react-redux";


import {
  CCard,
  CCardBody,
  CCol,
  CTextarea,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
  CImg,
  CInputFile,
  CSelect,
} from "@coreui/react";

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
     
      name: "",
      description: "",
      image: "",
      status: "",
      price: 0.0,
      avgTime: "",
      displayOrder: 1,
      dietType: "",
      uuid:'',
      errors: {
        name: "",
        description: "",
      },
      
    };

    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this._handleRadio = this._handleRadio.bind(this);
  }

  componentDidMount() {
    if (this.props.CurrentItem) {
      this.setState({
        id: this.props.CurrentItem.id,
        name: this.props.CurrentItem.name,
        description: this.props.CurrentItem.description,
        status: this.props.CurrentItem.status,
        price: this.props.CurrentItem.price,
        image: this.props.CurrentItem.image,
        avgTime: this.props.CurrentItem.avgTime,
        displayOrder: this.props.CurrentItem.displayOrder,
        dietType: this.props.CurrentItem.dietType,
        uuid:this.props.CurrentItem.uuid
      });
    } else {
      this.setState(this.initialState);
    }
  }

  _handleRadio(event) {
    const spicy = event.currentTarget.value === "true" ? true : false;
    this.setState({ spicy });
  }

  // handleChange(event) {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   this.setState({
  //     [name]: value,
  //   });
  // }
  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    let errors = this.state.errors;

    switch (name) {
      case "name":
        this.state.errors.name =
          value.length > 20
            ? " name must  not be greater than 2 characters long!"
            : "";
        break;
      case "description":
        this.state.errors.description =
          value.length > 100
            ? " description must  not be greater than 25 characters long!"
            : "";
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  }

  addItem(data) {
    this.setState(this.initialState);
    this.props.onHide();
    this.props.refresh();
    var Data ={
      name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          avgTime: data.avgTime,
          status: data.status,
          dietType: data.dietType,
    }
    ItemDataService.create(Data)
      .then((response) => {
        this.props.toast('successfully added','green')
       
      })
      .catch((e) => {
        console.log(e);
        this.props.toast('unSuccessful','#e55353')
      });
  }

  onFileChange = (event) => {
    if (
      event.target.files[0].type === "image/jpg" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      uploadService
        .upload(formData)
        .then((response) => {
          this.setState({ image: response.data });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert(event.target.files[0].type + "file type is not allowed to upload");
      event.preventDefault();
      return false;
    }
  };

  updateItem(id, item) {

    ItemDataService.update(id, item)
      .then((response) => {
        this.props.toast('successful updated','green')
        
       
      })
      .catch((e) => {
        console.log(e);
        this.props.toast('unSuccessful','#e55353');
      });
       this.props.onHide();
     
  }
  renderBtn(state) {
    if (state ==='') {
      return (
        <button
          type="button"
          className="btn btn-success"
          disabled={!validateForm(this.state.errors)}
          onClick={() => this.updateItem(this.state.id, this.state)}
          style={{ float: "right", margin: "8px" }}
        >
          Add Item
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-success"
          disabled={!validateForm(this.state.errors)}
          onClick={() => this.updateItem(this.state.id, this.state)}
          style={{ float: "right", margin: "8px" }}
        >
          Save Item
        </button>
      );
    }
  }

  render() {
    return (
      <div>
        <CRow>
          <CCol xs="12" md="12" className="formCard">
            <CCard>
              <CCardBody>
                <CForm>
                  <CRow>
                    <CCol xs="12" md="5">
                      <CFormGroup>
                        <CLabel htmlFor="image">Item Image</CLabel>
                        <CImg
                          src={this.state.image}
                          className="c-form-img"
                          alt="admin@bootstrapmaster.com"
                        />
                      </CFormGroup>
                      <CFormGroup>
                        <CInputFile
                          id="file-input"
                          name="image"
                          onChange={this.onFileChange}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="12" md="7">
                      <CFormGroup>
                        <CLabel htmlFor="name">Item Name</CLabel>
                        <CInput
                          id="name"
                          name="name"
                          placeholder="Enter item name.."
                          value={this.state.name}
                          onChange={this.handleChange}
                          noValidate
                        />
                        {this.state.errors.name.length > 0 && (
                          <span className="error" style={{ color: "red" }}>
                            {this.state.errors.name}
                          </span>
                        )}
                      </CFormGroup>

                      <CFormGroup>
                        <CLabel htmlFor="description">Description</CLabel>
                        <CTextarea
                          name="description"
                          id="description"
                          rows="4"
                          placeholder="description..."
                          value={this.state.description}
                          onChange={this.handleChange}
                          noValidate
                        />
                        <span className="error" style={{ color: "red" }}>
                          {this.state.errors.description}
                        </span>
                      </CFormGroup>
                      <CRow>
                        <CCol md="6">
                          <CFormGroup>
                            <CLabel htmlFor="price">item price</CLabel>
                            <CInput
                              id="price"
                              name="price"
                              placeholder="Enter item price.."
                              value={this.state.price}
                              onChange={this.handleChange}
                            />
                          </CFormGroup>
                        </CCol>
                        <CCol md="6">
                          <CFormGroup>
                            <CLabel htmlFor="price">Item Order </CLabel>
                            <CInput
                              id="order"
                              name="displayOrder"
                              placeholder="Enter item order.."
                              value={this.state.displayOrder}
                              onChange={this.handleChange}
                            />
                          </CFormGroup>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol lg="12">
                      <CRow>
                        <CCol xs="12" md="5">
                          <CFormGroup style={{ width: "250px" }}>
                            <CLabel htmlFor="name">Status</CLabel>
                            <CSelect
                              custom
                              name="status"
                              id="status"
                              value={this.state.status}
                              onChange={this.handleChange}
                            >
                              <option value="">Please select</option>
                              <option value="A">Available</option>
                              <option value="NA">Not Available</option>
                            </CSelect>
                          </CFormGroup>
                        </CCol>

                        <CCol xs="12" md="7">
                          <CRow>
                            <CCol md="6">
                              <CFormGroup>
                                <CLabel htmlFor="avgTime">average time</CLabel>
                                <CInput
                                  id="avgTime"
                                  name="avgTime"
                                  value={this.state.avgTime}
                                  onChange={this.handleChange}
                                />
                              </CFormGroup>
                            </CCol>
                            <CCol md="6">
                              <CFormGroup>
                                <CLabel htmlFor="dietType">Diet Type</CLabel>
                                <CRow className="dietType">
                                  <CCol lg="10">
                                    <CSelect
                                      custom
                                      name="dietType"
                                      id="dietType"
                                      value={this.state.dietType}
                                      onChange={this.handleChange}
                                    >
                                      <option value="n.a">Please select</option>
                                      <option value="icon-vegan"> Vegan</option>
                                      <option value="icon-veg"> Vegiterian</option>
                                      <option value="icon-non-veg-symbol">
                                        Non-Veg
                                      </option>
                                      <option value="icon-chicken">
                                        Chicken
                                      </option>
                                      <option value="icon-halal">Halal</option>
                                      <option value="icon-no-gluten">
                                        Gluten Free
                                      </option>
                                    </CSelect>
                                  </CCol>
                                  <CCol lg="2">
                                    <img src={`avatars/dietryType/${this.state.dietType}.png`} alt=''/>
                                  </CCol>
                                </CRow>
                              </CFormGroup>
                            </CCol>
                          </CRow>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            {this.renderBtn(this.state.id)}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.props.onHide()}
              style={{ float: "right", margin: "8px" }}
            >
              Cancel
            </button>
          </CCol>
        </CRow>
      </div>
    );
  }
}

const mapStateToProps = state => ({ toasterShow: state.toasterShow });

export default connect(mapStateToProps)(ItemForm);
