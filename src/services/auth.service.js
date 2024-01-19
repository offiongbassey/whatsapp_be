import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

import { responseHandler } from "../helpers/responseHandler.js";

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser =async(userData) => {
    const { name, phone, email, picture, status, password } = userData;

//hash password
    const user = await new UserModel({
        name, 
        phone,
        email, 
        status: status || DEFAULT_STATUS,
        picture: picture || DEFAULT_PICTURE,
        password
    }).save();

    return user;
}
