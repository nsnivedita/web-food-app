/* eslint-disable react/no-direct-mutation-state */
import React from 'react'
import uploadService from '../../../Services/upload.service'
import ItemDataService from '../../../Services/item.service'
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
  CSelect
} from '@coreui/react'




class ExtraForm extends React.Component {

    _isMounted = false;
  constructor(props) {
    super(props);
    this.initialState = {
      id:'',
      name: '',
      description: '',
      image: '',
      status:'',
      price:0.0,
      
     
    }
    

    this.state=this.initialState
    this.handleChange = this.handleChange.bind(this);
    


  }



    componentDidMount(){
        this._isMounted = true;
      if(this.props.CurrentExtra){
        if (this._isMounted) {
        this.setState({
          id:this.props.CurrentExtra.id,
          name:this.props.CurrentExtra.name,
          description:this.props.CurrentExtra.description,
          status:this.props.CurrentExtra.status,
          price:this.props.CurrentExtra.price,
          image:this.props.CurrentExtra.image,
         uuid:this.props.CurrentExtra.uuid
         
         })}
      }
      else{
        this.state=(this.initialState)
      }

      
    }

     



  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })

  }

  addItem(data) {
    this.props.onHide();
    this.setState(this.initialState)
    ItemDataService.createExtra(data)
      .then(response => {
        this.props.toast('Successfully added','green')
        this.setState({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          image: response.data.image,
          status:response.data.status

        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
        this.props.toast('unSuccessful','#e55353');
      });
      
  }

  onFileChange = event => { 
    const formData = new FormData(); 
    formData.append( 'file',event.target.files[0]	); 
    uploadService.upload(formData)
    .then(response => {
      // console.log(response.data);
      this.setState({image:response.data})
      // console.log(this.state.image)

    }).catch(e => {
      console.log(e);
    });
  }

  updateItem(id, item) {
    console.log(id,item);
    this.props.onHide();
    ItemDataService.updateExtra(
      id,
      item
    )
      .then(response => {
       
        this.props.toast('Successfully Updated','green')
      })
      .catch(e => {
        console.log(e);
        this.props.toast('unSuccessful','#e55353');
      });
  }
    renderBtn(id){
      if (id===''){
        return(
          <button type="button"  className="btn btn-success" onClick={() => this.addItem(this.state)} style={{ float: 'right', margin: '10px', }}>Add Extra</button>
          )
       }else{ 
         return(
          
        <button type="button"  className="btn btn-success" onClick={() => this.updateItem(this.state.id,this.state)} style={{ float: 'right', margin: '8px' }}>Save Extra</button>

         )
          
        }
    }

     componentWillUnmount() {
    this._isMounted = false;
  }
 

  render() {
    console.log(this.props.CurrentItem)
    console.log(this.state)
   

    return (
      <div>

        <CRow>

          <CCol xs="12" md="12" className="formCard">
            <CCard>
              <CCardBody>
              <CForm  >
                  <CRow>
                    <CCol xs="12" md="5">
                    <CFormGroup>
                      <CLabel htmlFor="image">Item Image</CLabel>
                      <CImg src={this.state.image} className="c-form-img" alt="admin@bootstrapmaster.com"/>
                     </CFormGroup>
                  <CFormGroup >
                    <CInputFile id="file-input" name="image"  onChange={this.onFileChange}/>
                   </CFormGroup>
                   
                    </CCol>
                    <CCol xs="12" md="6">
                    <CFormGroup>
                    <CLabel htmlFor="name">Item Name</CLabel>
                    <CInput id="name" name="name"   placeholder="Enter item name.." value={this.state.name} onChange={this.handleChange} /> 
                  </CFormGroup>


                  <CFormGroup >
                      <CLabel htmlFor="description">Description</CLabel>
                      <CTextarea
                        name="description"
                        id="description"
                        rows="4"
                        placeholder="description..."
                        value={this.state.description} onChange={this.handleChange}
                      />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="price">item price</CLabel>
                    <CInput id="price" name="price" placeholder="Enter item price.." value={this.state.price} onChange={this.handleChange} />

                  </CFormGroup>
                  </CCol>
                  <CCol lg="12">
                  <CRow>
                  <CCol xs="12" md="5">
                  <CFormGroup style={{width:'250px'}}>
                    <CLabel htmlFor="name">Status</CLabel>
                    <CSelect custom name="status" id="status" value={this.state.status} onChange={this.handleChange}>
                    <option value="">Please select</option>
                    <option value="A">Available</option>
                      <option value="NA">Not Available</option>
                      </CSelect>
                    
                  </CFormGroup>
                    </CCol>

                  </CRow>
                  
                  </CCol>
                  

                 
                    
                  </CRow>
                </CForm>
                </CCardBody>
                </CCard>
                {this.renderBtn(this.state.id)}
                <button type="button"  className="btn btn-secondary" onClick={() => this.props.onHide()} style={{ float: 'right', margin: '8px' }}>Cancel</button>

               
          </CCol>
        </CRow>


      </div>
    );
  };

}

export default ExtraForm