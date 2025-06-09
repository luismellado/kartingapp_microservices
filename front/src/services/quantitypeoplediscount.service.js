import httpClient from "../http-common";

const getAll = () => {
  return httpClient.get('/qopdiscount/kartingapp/qpdiscount/getall');
}

const update = (QuantityPeopleDiscount) => {
  return httpClient.put("/qopdiscount/kartingapp/qpdiscount/update", QuantityPeopleDiscount)
}

export default {getAll, update};