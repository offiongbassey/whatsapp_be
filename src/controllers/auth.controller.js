import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";
import jwt from "jsonwebtoken";
import { responseHandler } from "../helpers/responseHandler.js";
import { errorHandler } from "../helpers/errorHandler.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const register = async(req, res) => {
    try {
        
        const { name, email, picture, status, password } = req.body;
        const newUser = await createUser({
            name,
            email,
            picture,
            status, 
            password
        });

        const access_token = await generateToken(
            { userId: newUser._id }, 
            "30d", 
            process.env.ACCESS_TOKEN_SECRET);

        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        });

        const user = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            picture: newUser.picture,
            status: newUser.status,
            token: access_token
        }
        return responseHandler(res, 201, true, "Account Successfully Created", user);
        
    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later");
    }
}
 
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email.toLowerCase()}).lean();
        if(!user) return responseHandler(res, 400, false, "Invalid Credentials.", null);
    
        //compare password
        let password_matches = await bcrypt.compare(password, user.password);
        if(!password_matches) return responseHandler(res, 400, false, "Invalid Credentials.", null);

        const access_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.ACCESS_TOKEN_SECRET);
        
        const refresh_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET);
        
        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        const user_data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            status: user.status,
            token: access_token
        }
        return responseHandler(res, 201, true, "Account Successfully Created", user_data)
    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later");
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken', { path: "/api/v1/auth/refreshtoken"});
        return responseHandler(res, 200, true, "Logged out", null);

    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later");
    }
}

export const refreshToken= async (req, res, next) => {
    try {
       const refresh_token = req.cookies.refreshToken;
       if(!refresh_token) return responseHandler(res, 401, false, "Please login.")

       const check = await verifyToken(refresh_token, process.env.REFRESH_TOKEN_SECRET);
       const user = await findUser(check.userId);
    
       const access_token = await generateToken(
        { userId: user._id },
        "1d",
        process.env.ACCESS_TOKEN_SECRET
       );
  
        const user_data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            status: user.status,
            token: access_token
        }

        return responseHandler(res, 200, true, "Token refresh successful", user_data)
    } catch (error) { 
       await errorHandler(error);
       return responseHandler(res, 500, false, "Something went wrong, try again later");
    }
}

export const getLoginStatus = async (req, res, next) => {
    try {
        const { token } = req.params;
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                return responseHandler(res, 200, true, "User Logged Out", false)
            }else{
                return responseHandler(res, 200, true, "User Logged In", true)
            }  
        })

    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later");
    }
}