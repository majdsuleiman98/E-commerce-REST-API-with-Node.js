const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_API_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})


const cloudinaryUploadImage = async(fileToUpload) =>{
    try {
        const data = await cloudinary.uploader.upload(fileToUpload,{resource_type:"image"});
        return data;
    } catch (error) {
        return error;
    }
}


const cloudinaryRemoveImage = async(public_id) =>{
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage
}