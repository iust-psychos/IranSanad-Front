import axios from "axios"
import constants from './constants';
const Login = async (email ,username , password) => {
    const result = await axios.post(constants.baseUrl+'auth/login/' , {
        username : username,
        email : email,
        password : password,
    });
    return result;
}

export default {Login};