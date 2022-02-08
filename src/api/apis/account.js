// example
import api from '../api'
const base = '/account'

export default {
    example() {
        return api.get(`${base}`)
    }
}