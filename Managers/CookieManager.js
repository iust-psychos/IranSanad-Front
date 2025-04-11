import TokenCookieKey from "./constants";

const SaveToken = (expire, token) => {
  const date = new Date();
  date.setTime(date.getTime() + expire);
  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `${TokenCookieKey.TokenCookieKey}=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
};

const LoadToken = () => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === TokenCookieKey.TokenCookieKey) {
      return value;
    }
  }
  return null;
};

export default { SaveToken, LoadToken };
