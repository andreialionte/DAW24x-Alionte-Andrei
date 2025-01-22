import {jwtDecode, JwtPayload} from "jwt-decode"
interface CustomJwtPayload extends JwtPayload {
    userId: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  } //without this, i have many errors, i need to specify exactly what i have in the token exactly after its decoded
  
  export const DecodeJWT = (token: string): CustomJwtPayload => {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    return decodedToken;
  }