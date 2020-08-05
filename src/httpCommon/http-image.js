import axios from "axios";

export default axios.create({
  baseURL: "https://xgileit-bucket-service.herokuapp.com/api/s3/",
  headers: { "Content-Type": "multipart/form-data" },
});
