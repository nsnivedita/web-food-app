import http from "../httpCommon/http-Item";


class ItemDataService {

  //fetch all
  getAll() {
    return  http.get("/item");
  }
  //delete by id
  delete(id) {
    return http.delete(`/item/${id}`);
  }
  //add new item
  create(data) {
    return http.post("/item", data);
  }
  //update item
  update(id, data) {
    return http.put(`/item/${id}`, data);
  }

  updateItemStatus(id,newStatus) {
    return http.put(`/item/${id}?status=${newStatus}`);
  }


//GROUP 

getAllGroup() {
  return http.get("/group");
}
//delete group by id
deleteGroup(id) {
  return http.delete(`/group/${id}`);
}
//add new group
createGroup(data) {
  return http.post("/group", data);
}
//update group status
updateGroupStatus(id,newStatus) {
  return http.put(`/group/${id}?status=${newStatus}`);
}

//update group
  updateGroup(id, data) {
    return http.put(`/group/${id}`, data);
  }
  upload(data){
    return http.post("/upload", data);
  }


//All Menu
getAllMenu(){
  return http.get("/menus");
}

updateStatus(id){
  return http.get()

}

//Extra

getAllExtra(){

  return http.get('/extra')
}

deleteExtra(id){
  return http.delete(`/extra/${id}`)
}

createExtra(data) {
  return http.post("/extra", data);
}
//update group
  updateExtra(id, data) {
    return http.put(`/extra/${id}`, data);
  }
  //insert Item into group
  insertItem(groupId,itemId){
    return http.post('/group/addItem',{groupId,itemId})
  }

  //Add Modifiers
  addModifier(data){
    return http.post('/modifier',data)
  }

  updateModifier(itemId,data){
    return http.put(`/modifier/${itemId}`,data)
  }
  getModifier(itemId){
    return http.get(`/modifier/${itemId}`)
  }

  deleteModifer(id){
    return http.delete(`/modifier/${id}`)
  }
  
}
export default new ItemDataService();