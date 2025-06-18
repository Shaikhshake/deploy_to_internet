import axios from 'axios'



const baseUrl = 'http://localhost:3001/api/notes'


const getAll = () =>{
    
    return axios.get(baseUrl)
}

const create = (newObject) => {
    return axios.post(baseUrl, newObject)
}

const updateObject = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

const deleteObject = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll: getAll,
    create: create,
    updateObject: updateObject,
    deleteObject: deleteObject
}