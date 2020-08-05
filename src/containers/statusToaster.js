import React, { useState } from "react";
import { useSelector} from "react-redux";


import {
  
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CRow,
  CCol,
 
} from "@coreui/react";

const StatusToaster = () => {
  

  const show = useSelector((state) => state.toast.toasterShow);
  const message = useSelector((state) => state.toast.toasterMessage);
  const color = useSelector((state) => state.toast.toasterColor);
 
  const [toasts] = useState([
    { position: "bottom-right", autohide: 10000 },
  ]);

  

  const toasters = (() => {
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || [];
      toasters[toast.position].push(toast);
      return toasters;
    }, {});
  })();

 
  return (
    <CRow>
      
      <CCol sm="12" lg="6">
        {Object.keys(toasters).map((toasterKey) => (
          <CToaster position={toasterKey} key={"toaster" + toasterKey}>
            {toasters[toasterKey].map((toast, key) => {
              return (
                <CToast
                  key={"toast" + key}
                  show={show}
                  autohide={toast.autohide}
                  fade={toast.fade}
                >
                  <CToastHeader
                    closeButton={toast.closeButton}
                    style={{backgroundColor:`${color}`}}
                  >
                    toaster
                  </CToastHeader>
              <CToastBody>{message}</CToastBody>
                </CToast>
              );
            })}
          </CToaster>
        ))}
      </CCol>
    </CRow>
  );
};

export default StatusToaster;
