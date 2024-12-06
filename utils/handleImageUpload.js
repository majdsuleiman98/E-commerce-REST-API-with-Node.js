const path = require('path');
const fs = require('fs');
const {cloudinaryUploadImage, cloudinaryRemoveImage} = require('./cloudinary');

const handleImageUpload = async (file) => {
    const imagePath = path.join(__dirname, `../images/${file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    fs.unlinkSync(imagePath);
    return {
        url: result.url,
        public_id: result.public_id
    };
};


const handleImageUpdate = async (public_id,file) => {
    await cloudinaryRemoveImage(public_id);
    const imagePath = path.join(__dirname, `../images/${file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    fs.unlinkSync(imagePath);
    return {
        url: result.url,
        public_id: result.public_id
    };
};

module.exports = { 
    handleImageUpload,
    handleImageUpdate
};
