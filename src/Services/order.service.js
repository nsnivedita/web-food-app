import http from '../httpCommon/http-order'
 class OrderService{

    getAllorder() {
        return http.get("/order");
      }

      updateOrderStatus(id,newStatus) {
        return http.put(`/order/${id}?status=${newStatus}`);
      }

      
}

export default new OrderService()