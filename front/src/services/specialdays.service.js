import httpClient from "../http-common";

const getAll = () => {
  return httpClient.get('/spfee/kartingapp/spfee/getall')
}

//Obtener un lapOrTime por Id
const getById = (id) => {
  return httpClient.get(`/spfee/kartingapp/spfee/get/${id}`)
}

// Crear un nuevo día especial
const create = (specialFee) => {
  return httpClient.post("/spfee/kartingapp/spfee/add", specialFee)
}
  
  // Actualizar un día especial existente
const update = (specialFee) => {
  return httpClient.put("/spfee/kartingapp/spfee/update", specialFee)
}

const deleteSpDay = (id) => {
  return httpClient.delete(`/spfee/kartingapp/spfee/delete/${id}`)
}

export default {getAll, getById, create, update, deleteSpDay};