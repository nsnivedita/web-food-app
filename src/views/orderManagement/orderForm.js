import React from "react";
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CSelect,
} from "@coreui/react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";

const validationSchema = function (values) {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, `First name has to be at least 2 characters`)
      .required("First name is required"),
    lastName: Yup.string()
      .min(1, `Last name has to be at least 1 character`)
      .required("Last name is required"),
    userName: Yup.string()
      .min(5, `Username has to be at least 5 characters`)
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required!"),
    password: Yup.string()
      .min(6, `Password has to be at least ${6} characters!`)
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        "Password must contain: numbers, uppercase and lowercase letters\n"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([values.password], "Passwords must match")
      .required("Password confirmation is required"),
    accept: Yup.bool()
      .required("* required")
      .test(
        "accept",
        "You have to accept our Terms and Conditions!",
        (value) => value === true
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


const onSubmit = (values, { setSubmitting, setErrors }) => {
  setTimeout(() => {
    alert(JSON.stringify(values, null, 2));
    // console.log('User has been successfully saved!', values)
    setSubmitting(false);
  }, 2000);
};

const findFirstError = (formName, hasError) => {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
};

const validateForm = (errors) => {
  findFirstError("simpleForm", (fieldName) => {
    return Boolean(errors[fieldName]);
  });
};

const touchAll = (setTouched, errors) => {
  setTouched({
    firstName: true,
    lastName: true,
    userName: true,
    email: true,
    password: true,
    confirmPassword: true,
    accept: true,
  });
  validateForm(errors);
};

const OrderForm = (props) => {
  return (
    <CCard key={props.id}>
      <CCardBody>
        <Formik
          initialValues={props.order}
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
            setTouched,
          }) => (
            <CRow>
              <CCol lg="12" className="order-form">
                <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                  <CRow>
                    <CCol lg="8">
                      <span><b>Token No:</b> {values.orderCode}</span>
                      <br />

                      <CFormGroup>
                        <CRow>
                          <CCol lg="3">
                            <CLabel htmlFor="name"><b>Order Type:</b></CLabel>
                          </CCol>
                          <CCol lg="5">
                            <CSelect
                              custom
                              name="orderType"
                              placeholder="status"
                              autoComplete="family-name"
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.orderType}
                            >
                              <option value="">Please select</option>
                              <option value="1">Delivery</option>
                              <option value="2">Take Away</option>
                              <option value="3">Siting</option>
                            </CSelect>
                          </CCol>
                        </CRow>
                      </CFormGroup>

                      <span><b>Placed Time:</b> {values.placedTime}</span><br/>
                      <span><b>Expected Time:</b> {values.expectedTime}</span>
                    </CCol>
                    <CCol lg="" className="customer-info">
                      <h6>Customer Info</h6>
                      <div>
                        <span>name:{values.customerInfo.name}</span>
                        <br />
                        <span>Contact:{values.customerInfo.contactNo}</span>
                        <br />
                        <span>Address:{values.customerInfo.address}</span>
                      </div>
                    </CCol>
                  </CRow>

                  <CFormGroup className="option-header">
                    <CCol lg="4"></CCol>

                    <FieldArray
                      name="itemList"
                      render={(arrayHelpers) => (
                        <div className="item-card">
                          {values.itemList.map((item, index) => (
                            <div key={index}>
                              <CCard>
                                <CCardHeader>Item List</CCardHeader>
                                <CCardBody>
                                  <CRow>
                                    <CCol md="4">
                                      <CLabel>Name</CLabel>
                                      <CInput
                                        name={`itemList[${index}].itemName`}
                                        placeholder="Item Name"
                                        autoComplete="name"
                                        valid={!errors.name}
                                        invalid={touched.name && !!errors.name}
                                        required
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={item.itemName}
                                      />
                                    </CCol>
                                    <CCol md="2" className="mt-1">
                                      <CLabel htmlFor="optionEntity.price">
                                        Quantity
                                      </CLabel>
                                      <CInput
                                        name={`itemList.${index}.quantity`}
                                        placeholder="Quantity"
                                        autoComplete="quantity"
                                        valid={!errors.quantity}
                                        invalid={
                                          touched.quantity && !!errors.quantity
                                        }
                                        required
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={item.quantity}
                                      />
                                    </CCol>
                                    <CCol md="2" className="mt-1">
                                      <CLabel htmlFor="optionEntity.price">
                                        Price
                                      </CLabel>
                                      <CInput
                                        name={`itemList.${index}.price`}
                                        placeholder="Price"
                                        autoComplete="price"
                                        valid={!errors.price}
                                        invalid={
                                          touched.price && !!errors.price
                                        }
                                        required
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={item.price}
                                      />
                                    </CCol>

                                    <CCol md="4" className="mt-1">
                                      <CLabel>Instruction</CLabel>
                                      <CInput
                                        name={`itemList.${index}.instruction`}
                                        placeholder="instruction"
                                        autoComplete="instruction"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={item.instruction}
                                      />
                                    </CCol>
                                    <CCol lg="12">
                                      <FieldArray
                                        name="itemOptions"
                                        render={(arrayHelpers) => (
                                          <CCard>
                                            <CRow>
                                              {item.itemOptions.map(
                                                (items, index) => (
                                                  <CCol lg="4">
                                                    <CCardBody key={index}>
                                                      <CRow>
                                                        <CCol lg="12">
                                                          <CLabel htmlFor="options.name">
                                                            Name
                                                          </CLabel>
                                                          <CInput
                                                            name={`itemOptions[${index}].name`}
                                                            placeholder="Option Name"
                                                            autoComplete="name"
                                                            valid={!errors.name}
                                                            invalid={
                                                              touched.name &&
                                                              !!errors.name
                                                            }
                                                            required
                                                            onChange={
                                                              handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={items.name}
                                                          />
                                                        </CCol>
                                                        <CCol
                                                          lg="12"
                                                          className="mt-1"
                                                        >
                                                          <CLabel>Price</CLabel>
                                                          <CInput
                                                            name={`itemOptions.${index}.price`}
                                                            placeholder="Price"
                                                            autoComplete="price"
                                                            onChange={
                                                              handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={items.price}
                                                          />
                                                        </CCol>
                                                      </CRow>
                                                    </CCardBody>
                                                  </CCol>
                                                )
                                              )}
                                            </CRow>
                                            <CCol lg="12">
                                              <i
                                                className="fa fa-plus-circle"
                                                type="button"
                                                onClick={() =>
                                                  arrayHelpers.push({
                                                    name: "",
                                                    price: "0",
                                                  })
                                                }
                                                aria-hidden="true"
                                                style={{
                                                  fontSize: "26px",
                                                  marginRight: "15px",
                                                  marginBottom: "15px",
                                                  color: "#2eb85c",
                                                  float: "right",
                                                }}
                                              ></i>
                                            </CCol>
                                          </CCard>
                                        )}
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </div>
                          ))}
                          <CCol lg="12">
                            <i
                              className="fa fa-plus-circle"
                              type="button"
                              onClick={() =>
                                arrayHelpers.push({
                                  name: "",
                                  price: "0",
                                })
                              }
                              aria-hidden="true"
                              style={{
                                fontSize: "26px",
                                marginRight: "15px",
                                marginBottom: "15px",
                                color: "#2eb85c",
                                float: "right",
                              }}
                            ></i>
                          </CCol>
                        </div>
                      )}
                    />
                  </CFormGroup>

                  <CFormGroup>
                    <CButton
                      type="submit"
                      color="primary"
                      className="mr-1"
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "Wait..." : "Submit"}
                    </CButton>
                    <CButton
                      type="button"
                      color="success"
                      className="mr-1"
                      onClick={() => touchAll(setTouched, errors)}
                      disabled={isValid}
                    >
                      Validate
                    </CButton>
                    <CButton
                      type="reset"
                      color="danger"
                      className="mr-1"
                      onClick={handleReset}
                    >
                      Reset
                    </CButton>
                  </CFormGroup>
                </CForm>
              </CCol>
              <CCol lg="12">
                <CCard color={isValid ? "gradient-info" : "gradient-secondary"}>
                  <CCardBody>
                    <pre>values: {JSON.stringify(values, null, 2)}</pre>
                    <pre>errors: {JSON.stringify(errors, null, 2)}</pre>
                    <pre>touched: {JSON.stringify(touched, null, 2)}</pre>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default OrderForm;

/*<Formik
          initialValues={props.order}
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
            setTouched,
          }) => (
            <CRow>
              <CCol lg="6">
                <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                  <span>Token No:  {values.orderCode}</span>
                  
                  <CCard>
                    <CFormGroup className="option-header">
                      <CCardHeader htmlFor="name">
                        Customer Information
                      </CCardHeader>

                      <FieldArray
                        name="customerInfo"
                        render={(arrayHelpers) => (
                          <div>
                            {values.customerInfo.map((item, index) => (
                              <CCardBody key={index}>
                                <CRow>
                                  <CCol md="">
                                    <CLabel htmlFor="customerInfo.name">
                                      Name
                                    </CLabel>
                                   
                                  </CCol>
                                  <CCol md="3" className="mt-1">
                                    <CLabel htmlFor="customerInfo.co">
                                      Price
                                    </CLabel>
                                    <CInput
                                      name={`customerInfo.${index}.contactNo`}
                                      placeholder="Contact No"
                                      autoComplete="Contact No"
                                      valid={!errors.contactNo}
                                      invalid={
                                        touched.contactNo && !!errors.contactNo
                                      }
                                      required
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={item.contactNo}
                                    />
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            ))}
                          </div>
                        )}
                      />

                      <CCol lg="4">
                        <CFormGroup>
                          <CLabel htmlFor="name">Order Type</CLabel>
                          <CSelect
                            custom
                            name="orderType"
                            placeholder="status"
                            autoComplete="family-name"
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.orderType}
                          >
                            <option value="">Please select</option>
                            <option value="1">Delivery</option>
                            <option value="2">Take Away</option>
                            <option value="3">Siting</option>
                          </CSelect>
                        </CFormGroup>
                      </CCol>

                      <FieldArray
                        name="itemList"
                        render={(arrayHelpers) => (
                          <div>
                            {values.itemList.map((item, index) => (
                              <CCardBody key={index}>
                                <CRow>
                                  <CCol md="12">
                                    <CLabel >Name</CLabel>
                                    <CInput
                                      name={`itemList[${index}].name`}
                                      placeholder="Item Name"
                                      autoComplete="name"
                                      valid={!errors.name}
                                      invalid={touched.name && !!errors.name}
                                      required
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={item.name}
                                    />
                                  </CCol>
                                  <CCol md="3" className="mt-1">
                                    <CLabel htmlFor="optionEntity.price">
                                      Price
                                    </CLabel>
                                    <CInput
                                      name={`itemList.${index}.quantity`}
                                      placeholder="Quantity"
                                      autoComplete="quantity"
                                      valid={!errors.quantity}
                                      invalid={touched.quantity && !!errors.quantity}
                                      required
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={item.quantity}
                                    />
                                  </CCol>
                                  <CCol md="3" className='mt-1'>
                                  <CLabel htmlFor="optionEntity.price">
                                    Price
                                  </CLabel>
                                  <CInput
                                    name={`itemList.${index}.price`}
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
                                
                                <CCol md="3" className='mt-1'>
                                  <CLabel >
                                    Instruction
                                  </CLabel>
                                  <CInput
                                    name={`itemList.${index}.instruction`}
                                    placeholder="instruction"
                                    autoComplete="instruction"
                                    
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={item.instruction}
                                  />
                                </CCol>
                                
                                
                                  <FieldArray
                                    name="itemOptions"
                                    render={(arrayHelpers) => (
                                      <div>
                                        {item.itemOptions.map((items, index) => (
                                          <CCardBody key={index}>
                                            <CRow>
                                              <CCol md="12">
                                                <CLabel htmlFor="options.name">
                                                  Name
                                                </CLabel>
                                                <CInput
                                                  name={`itemOptions[${index}].name`}
                                                  placeholder="Option Name"
                                                  autoComplete="name"
                                                  valid={!errors.name}
                                                  invalid={
                                                    touched.name &&
                                                    !!errors.name
                                                  }
                                                  required
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  value={items.name}
                                                />
                                              </CCol>
                                              <CCol md="3" className="mt-1">
                                                <CLabel >
                                                  Price
                                                </CLabel>
                                                <CInput
                                                  name={`itemOptions.${index}.price`}
                                                  placeholder="Price"
                                                  autoComplete="price"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  value={items.price}
                                                />
                                              </CCol>
                                              
                                              
                                            </CRow>
                                          </CCardBody>
                                        ))}
                                        <CCol lg="12">
                                          <i
                                            className="fa fa-plus-circle"
                                            type="button"
                                            onClick={() =>
                                              arrayHelpers.push({
                                                name: "",
                                                price: "0",
                                              })
                                            }
                                            aria-hidden="true"
                                            style={{
                                              fontSize: "26px",
                                              marginRight: "15px",
                                              marginBottom: "15px",
                                              color: "#2eb85c",
                                              float: "right",
                                            }}
                                          ></i>
                                        </CCol>
                                      </div>
                                    )}
                                  />
                                </CRow>
                              </CCardBody>
                            ))}
                            <CCol lg="12">
                              <i
                                className="fa fa-plus-circle"
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    name: "",
                                    price: "0",
                                  })
                                }
                                aria-hidden="true"
                                style={{
                                  fontSize: "26px",
                                  marginRight: "15px",
                                  marginBottom: "15px",
                                  color: "#2eb85c",
                                  float: "right",
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
                      color="primary"
                      className="mr-1"
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "Wait..." : "Submit"}
                    </CButton>
                    <CButton
                      type="button"
                      color="success"
                      className="mr-1"
                      onClick={() => touchAll(setTouched, errors)}
                      disabled={isValid}
                    >
                      Validate
                    </CButton>
                    <CButton
                      type="reset"
                      color="danger"
                      className="mr-1"
                      onClick={handleReset}
                    >
                      Reset
                    </CButton>
                  </CFormGroup>
                </CForm>
              </CCol>
              <CCol lg="6">
                <CCard color={isValid ? "gradient-info" : "gradient-secondary"}>
                  <CCardBody>
                    <pre>values: {JSON.stringify(values, null, 2)}</pre>
                    <pre>errors: {JSON.stringify(errors, null, 2)}</pre>
                    <pre>touched: {JSON.stringify(touched, null, 2)}</pre>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </Formik>
       */
