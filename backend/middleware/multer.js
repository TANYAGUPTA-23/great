import multer from 'multer'; //a middleware for handling multipart/form-data
const storage = multer.diskStorage({ //tells Multer to store uploaded files on disk instead of memory.
    filename: function(req , file , callback){
        callback(null , file.originalname)
    }
})
// req → HTTP request object.
// file → The file object being uploaded.
// callback → A function to set the stored file's name.
// file.originalname keeps the same name as the uploaded file.

const upload = multer({storage})

export default upload