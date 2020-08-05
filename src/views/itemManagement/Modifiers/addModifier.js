import React from "react";
import ItemDataService from "../../../Services/item.service";
import { useSelector, useDispatch} from "react-redux";


import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInvalidFeedback,
  CInput,
  CLabel,
  CSelect,
  CRow,
} from "@coreui/react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";

const validationSchema = function (values) {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, `First name has to be at least 2 characters`)
      .required("name is required"),
    status: Yup.string().required("status is required"),
    ruleId:Yup.string().required("status is required"),
    
    options: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().min(2, "too short").required("Required"),
        status: Yup.string().required("required"),
        price: Yup.string().required("required"), // these constraints take precedence
      })
    ),
  });
};

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

const getErrorsFromValidationError = (validationError) => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    };
  }, {});
};

const deleteIndex =(item,arrayHelpers,id,index)=>{
  if(index>0){return(
    <CButton  onClick={() =>
      arrayHelpers.pop({
       index
      })
    }  style={{
      fontSize: "30px",
      marginTop:'30px',
      color: "#e55353",
      border:'1px solid #2eb85c',
      padding:'.05rem .5rem'
    }}>
    <i
    className="fa fa-trash"
   
    aria-hidden="true"
    style={{
      fontSize: "15px",}}
  ></i>
 </CButton>
    )

  }
}



export default function AddModifiers(props) {

  const dispatch = useDispatch()
  const toasterShow = useSelector(state => state.toast.toasterShow)

  const renderToaster=(message,color)=>{
    
    dispatch({type: 'set', toast: {
      toasterShow:!toasterShow,
        toasterMessage:message,
        toasterColor:color
    }})

  }
  

  const onSubmit = (values) => {
    if(props.id){
      
      ItemDataService.addModifier( values)
      .then((response) => {
        renderToaster('Modifier Added Succesfully','green')
        this.setState({
          message: "Modifiers was updated successfully!",
        });
      })
      .catch((e) => {
        renderToaster('unSuccessful','#e55353')
        console.log(e);
      });
    }else
    ItemDataService.updateModifier(props.Id, values)
      .then((response) => {
        renderToaster('Modifier Updated Succesfully','green')

        this.setState({
          
          message: "Modifiers was updated successfully!",
        });
      })
      .catch((e) => {
        renderToaster('unSuccessful','#e55353')
        console.log(e);
      });
  };
 

  const deleteModifier= ()=>{
    ItemDataService.deleteModifer(props.Id)
    .then((res)=>{
      
    })
    
  };
  const renderReset = (handleReset, values) => {
    if (props.id) {
      return (
        <CButton
          type="reset"
          color="gray"
          className="mr-1 p-2"
          onClick={handleReset}
        >
          Reset
        </CButton>
      );
    }else{
      return (
        <CButton
          
          color="danger"
          className="mr-1 p-2"
          onClick={deleteModifier}
        >
          Delete
        </CButton>
      );
    }
  };
  return (
    <CCard className="modifier-form">
      <CCardHeader className='form-header' >Add Modifier</CCardHeader>
      <CCardBody  >
        <Formik
          initialValues={props.modifiers}
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            status,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
            handleReset,
            setTouched
          }) => (
            <CRow>
              <CCol lg="12">
                <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                  <CFormGroup>
                    
                    <CLabel htmlFor="firstName">Modifier Name</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      placeholder="name"
                      autoComplete="given-name"
                      valid={!errors.name}
                      invalid={touched.name && !!errors.name}
                      //autoFocus={true}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                  <CRow>
                    <CCol lg="6">
                      <CFormGroup>

                        <CLabel htmlFor="name">Status</CLabel>
                        <CSelect
                          custom
                          name="status"
                          placeholder="status"
                          autoComplete="family-name"
                          valid={!errors.status}
                          invalid={touched.status && !!errors.status}
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.status}
                        >
                          <option value="">Please select</option>
                          <option value="A">Available</option>
                          <option value="NA">Not Available</option>
                        </CSelect>
                      </CFormGroup>
                    </CCol>
                    <CCol lg="6">
                      <CFormGroup>
                        <CLabel htmlFor="name">Rule</CLabel>
                        <CSelect
                          custom
                          name="ruleId"
                          placeholder="Rule"
                          autoComplete="family-name"
                          valid={!errors.ruleId}
                          invalid={touched.ruleId && !!errors.ruleId}
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.ruleId}
                        >
                          <option value="">Please select</option>
                          <option value="1">Required</option>
                          <option value="2">Choose up to 1</option>
                          <option value="3">Choose up to 2</option>
                          
                        </CSelect>
                        <CInvalidFeedback>{errors.rule}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CCard>
                  <CFormGroup className="option-header">
                    <CCardHeader htmlFor="name">
                      Option
                    </CCardHeader>
                    
                    <FieldArray
                      name="options" 
                      render={(arrayHelpers) => (
                        
                        <div>
                          {values.options.map((item, index) => (
                            <CCardBody key={index}>
                              <CRow>
                                <CCol md="12">
                                  <CLabel htmlFor="options.name">
                                    Name
                                  </CLabel>
                                  <CInput
                                    name={`options[${index}].name`}
                                    placeholder="Option Name"
                                    autoComplete="name"
                                    valid={!errors.name}
                                    invalid={touched.name && !!errors.name}
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={item.name}
                                  />
                                </CCol>
                                <CCol md="3" className='mt-1'>
                                  <CLabel htmlFor="optionEntity.price">
                                    Price
                                  </CLabel>
                                  <CInput
                                    name={`options.${index}.price`}
                                    placeholder="Price"
                                    autoComplete="price"
                                    valid={!errors.price}
                                    invalid={touched.price && !!errors.price}
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={item.price}
                                  />
                                </CCol>
                                <CCol lg="7" className='mt-1 option-status' >
                                  <CLabel htmlFor="name">Status</CLabel>
                                  <CSelect
                                    name={`options.${index}.status`}
                                    placeholder="Status"
                                    autoComplete="Status"
                                    valid={!errors.status}
                                    invalid={touched.status && !!errors.status}
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={item.status}
                                  >
                                    <option value="">Please select</option>
                                    <option value="A">Available</option>
                                    <option value="NA">Not Available</option>
                                  </CSelect>
                                </CCol>
                                <CCol lg="2" key={index}>
                                {
                                  deleteIndex(item,arrayHelpers,item.id,index)
                                }
                                 
                                </CCol>
                              </CRow>
                              </CCardBody>
                          ))}
                          <CCol lg='12'>
                          <i
                            className="fa fa-plus-circle"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                name: "",
                                price: "0",
                                status: "A",
                              })
                            }
                            aria-hidden="true"
                            style={{
                              fontSize: "26px",
                              marginRight:'15px',
                              marginBottom: "15px",
                              color: "#2eb85c",
                              float:'right'
                            }}
                          ></i>
                           </CCol>
                        </div>
                      )}
                    />
                   
                    
                  </CFormGroup>
                  </CCard>
                  <CFormGroup>
                    <CButton
                      type="submit"
                      color="success"
                      className="mr-1 p-2"
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "Submitted" : "Submit"}
                    </CButton>

                    {renderReset(handleReset,values)}
                  </CFormGroup>
                </CForm>
              </CCol>
            </CRow>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
}
