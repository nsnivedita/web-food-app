/* eslint-disable react/no-direct-mutation-state */
import React from 'react'
import ItemDataService from '../../../Services/item.service'
import uploadService from '../../../Services/upload.service'
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
  CInputFile,
  CImg,
  CSelect
} from '@coreui/react'
import StatusToaster from '../../../containers/statusToaster';


const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class GroupForm extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      id:'',
      name: '',
      description: 'xyz',
      image: '',
      status:'',
      selectedFile:null,
      uuid:'',
      errors: {
        name: '',
        description: '',        
      },
      show:false

      
    }

    this.state=this.initialState
    this.handleChange = this.handleChange.bind(this);


  }
  componentDidMount(){
    if(this.props.currentGroup){
      this.setState({id:this.props.currentGroup.id,name:this.props.currentGroup.name,image:this.props.currentGroup.image,
      description:this.props.currentGroup.description,status:this.props.currentGroup.status,uuid:this.props.currentGroup.uuid})
    }
    else{
      this.state=this.initialState
    }
  }
  


  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    let errors = this.state.errors;
    
    switch (name) {
      case 'name': 
        this.state.errors.name = 
          value.length > 25
            ? ' name must  not be greater than 25 characters long!'
            : '';
        break;
        case 'description': 
        this.state.errors.description = 
          value.length > 100
            ? ' description must  not be greater than 100 characters long!'
            : '';
        break;
      default:
        break;
    }
    this.setState({errors, [name]: value});
  }
  onFileChange = event => { 
    if(event.target.files[0].type === "image/jpg" || event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png")
    {
      const formData = new FormData(); 
      formData.append( 'file',event.target.files[0]	); 
      uploadService.upload(formData)
      .then(response => {
          this.setState({image:response.data})
      }).catch(e => {
        console.log(e);
      });
    }
    else{
      alert(event.target.files[0].type + "file type is not allowed to upload");
      event.preventDefault();
      return false;
    }

  }
  

  addGroup(data) {
    console.log(this.state.errors);
    this.props.onHide();
    this.setState(this.initialState)

    if(validateForm(this.state.errors)){
      console.log("valid")
          ItemDataService.createGroup(data)
      .then(response => {
        this.props.toast('Successfully Added','green')
        this.setState({
          name: response.data.name,
          description: response.data.description,
          image: response.data.image,
          status:response.data.status

        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
        this.props.toast('Unsuccessful','#e55353');
      });
    }
    else console.log("invaild")
  }
  

  updateGroup(id, group) {
    console.log(id,group);
    this.props.onHide();
    this.setState({show:this.props.toasterShow})
    ItemDataService.updateGroup(
      id,
      group
    )
      .then(response => {
        console.log(response.status);
        this.props.toast('Successfully Updated','green')
        
      })
      .catch(e => {
        console.log(e);
        this.props.toast('Unsuccessful','#e55353');
      });
  }

  

  renderBtn(image){
    if (image==="xyz"){
      return(
        <button type="button"  className="btn btn-success" disabled={!validateForm(this.state.errors)} onClick={() => this.addGroup(this.state)} style={{ float: 'right', margin: '10px', }}>Add Group</button>
        )
     }else{
      return(
        <button type="button"  className="btn btn-success" disabled={!validateForm(this.state.errors)} onClick={() => this.updateGroup(this.state.id,this.state)} style={{ float: 'right', margin: '8px' }}>Save Group</button>

         )
       
      }
  }

  render() {
    console.log(this.props.currentGroup);
    

    return (
     
      <div>
        <CRow>
          <CCol xs="12" md="12" className="formCard">
            <CCard>
              <CCardBody>
                <CForm>
                  <CRow>
                <CCol xs="12" md="5">
                   <CFormGroup >
                  
                    <CLabel htmlFor="image">Group Image</CLabel>
                    <CImg src={this.state.image} className="c-form-img" alt="admin@bootstrapmaster.com"/>
                  </CFormGroup>
                  <CFormGroup row>
                    <CInputFile id="file-input" name="image"  onChange={this.onFileChange}/>
                  </CFormGroup>
                </CCol>
                <CCol md="6">
                  <CFormGroup >
                    <CLabel htmlFor="name">group name</CLabel>
                    <CInput id="name" name="name" placeholder="Enter group name.." value={this.state.name} onChange={this.handleChange} noValidate />
                    {this.state.errors.name.length > 0 && 
                <span className='error' style={{color:"red"}}>{this.state.errors.name}</span>}
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="name">Status</CLabel>
                    <CSelect custom name="status" id="status" value={this.state.status} onChange={this.handleChange}>
                    <option value="">Please select</option>
                    <option value="A">Available</option>
                      <option value="NA">Not Available</option>
                      </CSelect>
                    
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="description">Description</CLabel>
                    <CTextarea
                        name="description"
                        id="description"
                        rows="4"
                        placeholder="description..."
                        value={this.state.description} onChange={this.handleChange}
                        noValidate
                      />
                      <span className='error' style={{color:"red"}}>{this.state.errors.description}</span>
                    
                  </CFormGroup>
                  
                  </CCol>
                 
                  {/* <input type="file" onChange={this.onFileChange} />  */}
                  </CRow>
                 
                </CForm>
              </CCardBody>
             
            </CCard>
            {this.renderBtn(this.state.image)}
             <button type="button"  className="btn btn-secondary" onClick={() => this.props.onHide()} style={{ float: 'right', margin: '8px' }}>Cancel</button>

          </CCol>
        </CRow>
        <StatusToaster color="green" title="title"  message="message.........."/>
      </div>
    );
  };

}

function mapStateToProps(state ){
  return {
    toasterShow
    : state.show
  };
}

export default connect(mapStateToProps)(GroupForm)