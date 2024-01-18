import jwt from "jsonwebtoken";
import { responseHandler } from "../helpers/responseHandler.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default async function (req, res, next) {
  try {
    
    if(!req.headers['authorization']) {
      return responseHandler(res, 401, false, "Please login")
    } 
    const bearerToken = req.headers["authorization"];
    const token = bearerToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
          return responseHandler(res, 401, false, "Please login");
        }
        req.user = payload;
        next();
    });

  } catch (error) {
    await errorHandler(error);
    return responseHandler(res, 500, false, "Something went wrong, try again later");
  }

}