import axios from "axios"
import constants from './constants';
const Signup = async (username,email,repeatpassword , password) => {
    const result = await axios.post(constants.baseUrl+'auth/register/' , {
        email : email,
        password : password,
        password2: repeatpassword,
        username: username
    });
    return result;
}

export default {Signup};