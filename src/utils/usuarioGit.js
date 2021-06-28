const axios = require("axios");

const  BASE_URL = 'https://api.github.com/users'

module.exports = {
    getUsuario: (yourName) => axios({
        method:"GET",
        url : BASE_URL + `/`+yourName,
        headers: {
            "content-type":"application/x-www-form-urlencoded"
        }
    })
}