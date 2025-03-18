import axios from "axios"
import constants from './constants';
const Login = async (email , password) => {
    const result = await axios.post(constants.baseUrl+'auth/login/' , {
        email : email,
        password : password,
    });
    return result;
}

export default {Login};