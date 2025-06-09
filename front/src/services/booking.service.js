import httpClient from "../http-common";

const newBooking = (booking) => {
  return httpClient.post('/booking/kartingapp/booking/newbooking', booking)
}

export default {newBooking}