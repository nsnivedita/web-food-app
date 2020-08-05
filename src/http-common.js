import axios from 'axios'

export default axios.create({
    baseURL: "https://xgileit-item-service.herokuapp.com/api/v1",
    headers: {"content-type":"application/json"}
});