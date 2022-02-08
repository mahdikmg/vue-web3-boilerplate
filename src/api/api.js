import axios from 'axios'

const baseURL = `${process.env.VUE_APP_BASE_URL}`

let instance = axios.create({
    baseURL,
    headers: {
        Accept: 'application/json',
    }
})

export default instance