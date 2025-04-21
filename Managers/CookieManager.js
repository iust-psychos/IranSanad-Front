import TokenCookieKey from "./constants";
import Cookies from 'js-cookie';
const SaveToken = (expire, token) => {
    Cookies.set(TokenCookieKey.TokenCookieKey , token , {expires: expire});
}

const LoadToken = () => {
    return Cookies.get(TokenCookieKey.TokenCookieKey);
}

export default { SaveToken , LoadToken };
