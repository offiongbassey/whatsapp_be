export const errorHandler = async (error) => {
    if(process.env.NODE_ENV !== "production"){
        console.log(error);
    }
}