import httpClient from "../http-common";

const getAllInfo = () => {
    return httpClient.get('/weeklyrack/kartingapp/rackinfo/getallinfo')
}

export default {getAllInfo}