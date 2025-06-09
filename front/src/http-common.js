import axios from "axios";

const kartingappBackendServer = import.meta.env.VITE_KARTINGAPP_BACKEND_SERVER;
const kartingappBackendPort = import.meta.env.VITE_KARTINGAPP_BACKEND_PORT;

console.log(kartingappBackendServer)
console.log(kartingappBackendPort)

export default axios.create({
    baseURL: `http://${kartingappBackendServer}:${kartingappBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});