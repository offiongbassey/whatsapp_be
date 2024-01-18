import createHttpError from "http-errors";
import { searchUsers as searchUsersService } from "../services/user.service.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { errorHandler } from "../helpers/errorHandler.js";
export const searchUsers = async (req, res, next) => {
    try {
       const keyword = req.query.search;
       if(!keyword){
        return responseHandler(res, 404, false, "Oops. Something went wrong", null);
       }
       const users = await searchUsersService(keyword, req.userId);
       return responseHandler(res, 200, true, "Success", users);

    } catch (error) {
       await errorHandler(error);
       return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}
