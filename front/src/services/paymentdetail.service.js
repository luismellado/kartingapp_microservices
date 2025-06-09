import httpClient from "../http-common";

// Crear un nuevo día especial
const newPaymentDetail = (paymentDetail) => {
  return httpClient.post("/booking/kartingapp/paymentdetail/newpaymentdetail", paymentDetail)
}

const excelVoucher = (bookingId) => {
  return httpClient.get(`/booking/kartingapp/paymentdetail/excelVoucher/${bookingId}`, {
    responseType: 'blob',
    headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Cache-Control': 'no-cache'}
    })
}

export default {newPaymentDetail, excelVoucher}