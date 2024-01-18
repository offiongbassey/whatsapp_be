import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";
import { responseHandler } from "../helpers/responseHandler.js";

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser =async(userData) => {
    const { name, email, picture, status, password } = userData;

    //check if fields are empty
    if(!name || !email || !password){
        throw createHttpError.BadRequest("Please fill all fields");
    }
    // check name Length
    if(!validator.isLength(name, {
        min: 2,
        max: 16,
    })){
        throw createHttpError.BadRequest("Please make sure your name is between 2 and 16 characters");
    }

    //check status length
    if(status && status.length > 64){
            throw createHttpError.BadRequest("Please make sure that your status is less than 64 characters");
    }
    //check if email is valid
    if(!validator.isEmail(email)){
        throw createHttpError.BadRequest("Please provide a valid email address");
    }

    //check if user already exist
    const checkDb = await UserModel.findOne({ email });
    if(checkDb){
        throw new Error("Email address already exist")
        // throw createHttpError.Conflict("Email address already exist");
    }
    //check password length
    if(!validator.isLength(password, {
        min:6,
        max: 128
    })){
        throw createHttpError.BadRequest("Please make sure your password is between 6 and 128 characters.");
    }
//hash password

    const user = await new UserModel({
        name, 
        email, 
        status: status || DEFAULT_STATUS,
        picture: picture || DEFAULT_PICTURE,
        password
    }).save();

    return user;
}

export const signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email.toLowerCase()}).lean();
    if(!user)throw createHttpError.NotFound("Invalid Credentials.");

    //compare password
    let password_matches = await bcrypt.compare(password, user.password);
    if(!password_matches) throw createHttpError.NotFound("Invalid Credentials.");

    return user;
}