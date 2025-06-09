import httpClient from "../http-common";

//Obtener todos los lapOrTime
const getAll = () => {
    return httpClient.get('/lotp/kartingapp/lotp/getall');
}

// Actualizar un lapOrTime que ya existe
const update = (lapOrTimePrice) => {
    return httpClient.put("/lotp/kartingapp/lotp/update", lapOrTimePrice)
  }

const getById = (id) => {
  return httpClient.get(`/lotp/kartingapp/lotp/get/${id}`)
}
export default {getAll, update, getById};