import http from '../httpCommon/http-image'

class UploadService {

    //upload file
    upload(data){
      return http.post("/upload", data);
    }
  
  }
  export default new UploadService();