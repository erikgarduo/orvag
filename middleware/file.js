const multer = require("multer");

const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
};

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        const isValid=MIME_TYPE_MAP[file.mimetype];
        let error =new Error('Invalid mime type');
        if(isValid){
            error= null;
        }
        cb(error, "backend/images");
    },
    filename: (req,file,cb)=>{
        const name= file.originalname.toLowerCase().split(' ').join('_');
        const ext= MIME_TYPE_MAP[file.mimetype];
        const imageFullNAme=name + '_' + Date.now() + '.'+ ext;
        console.log('nombre del archivo: ',imageFullNAme);
        cb(null,imageFullNAme);
    }
});

module.exports = multer ({ storage: storage}).single("image");