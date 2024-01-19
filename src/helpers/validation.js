import { validationResult } from "express-validator";
import { responseHandler } from "./responseHandler";
import { UserModel } from "../models";

export const checkAllowedFields = (payload, fields) => {
    payload = Array.isArray(payload) ? payload : [payload];

    payload.forEach((item) => {
        const allowed = Object.keys(item).every(field => fields.includes(field));
        fields = typeof fields === 'string' ? fields : fields.join(', ');

        if(!allowed){
            throw new Error(`Wrong fields passed. Allowed fields: ${ fields }`);
        }
    })
    return true;
}

export const validationHandler = (values = []) => {
    return async (req, res, next) => {
        await Promise.all(values.map((value) => value.run(req)));

        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        const _errors = errors.array();
        let message = "Invalid Parameters:";

        _errors.forEach((v) => {
            message += `${ v.param },`;
        });
        const new_error = errors.array();
        responseHandler(res, 422, false, new_error );
    }
};

export const titleCase = async (name) => {
    return name?.toLowerCase()?.split(' ').map(function (text){
        return (text?.charAt(0).toUpperCase() + text?.slice(1));
    }).join(' ');
}

export const verifyEmail = async (email) => {
    const check_email = await UserModel.findOne({ email });
    if(check_email){
        throw new Error("Email already exist.");
    }
    return true;
}

export const verifyPhone = async (phone) => {
    const check_phone = await UserModel.findOne({ phone });
    if(check_phone){
        throw new Error("Phone Number already exist.")
    }
}