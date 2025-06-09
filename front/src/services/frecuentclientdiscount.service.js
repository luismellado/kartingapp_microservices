import httpClient from "../http-common"

// Obtener todas las opciones de descuento por cliente frecuente
const getAll = () => {
  return httpClient.get("/fcdiscount/kartingapp/freqclientdisc/getall")
}

// Actualizar una opción existente
const update = (frequentCustomerDiscount) => {
  return httpClient.put("/fcdiscount/kartingrm/freclientdisc/update", frequentCustomerDiscount)
}

export default {getAll, update}