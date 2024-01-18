export const responseHandler = async (res, statusCode, success, message, data) => {
    return res.status(statusCode).json({ success, statusCode, message, data });
}