const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/apiError');


const Storage =  multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null,path.join(__dirname,`../images/`))
        },
        filename: function(req,file,cb){
            if(file){
                cb(null, new Date().toISOString().replace(/:/g,"-") + file.originalname);
            }   
            else{
                cb(null,false);
            }
        }
    })

const fileFilter = function(req,file,cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new ApiError('Unsupported file format',400));
    }
}

const upload = multer({storage:Storage,fileFilter:fileFilter,limits:{fileSize:1024*1024}});


module.exports = {upload};