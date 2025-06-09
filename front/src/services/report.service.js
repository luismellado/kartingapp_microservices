import httpClient from "../http-common";

const getLopReport = (year, firstMonth, lastMonth) => {
    return httpClient.get(`/report/kartingapp/reports/lopReport/${year}/${firstMonth}/${lastMonth}`, {
    responseType: 'blob',
    headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Cache-Control': 'no-cache'}
    })
}

const getQopReport = (year, firstMonth, lastMonth) => {
    return httpClient.get(`/report/kartingapp/reports/qopReport/${year}/${firstMonth}/${lastMonth}`, {
    responseType: 'blob',
    headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Cache-Control': 'no-cache'}
    })
}

export default {getLopReport, getQopReport}