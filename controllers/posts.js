const Post =require('../models/post');

exports.createPost=(req,res,next)=>{
    const url =req.protocol+'://'+ req.get("host");

    const post=new Post ({
        title:req.body.title,
        content:req.body.content,
        imagePath: url+ "/images/" +req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost =>{
        res.status(201).json({
            message: 'Post agregado exitosamente',
            post:{
                ...createdPost,// se pasa todo el objeto directo.
                id:createdPost._id, //solo se sobrescribe esta propiedad.
            }
            
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fallo el registro del post"
        })
    });
};

exports.updatePost=(req, res, next) => {
    let imagePath= req.body.imagePath;
    if(req.file){
        const url= req.protocol+ "://" +req.get("host");
        imagePath=url+"/images/" + req.file.filename;
    }
    console.log('imagePath',imagePath);

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        //la n=  a si encontro el registro en mongo
    if(result.n>0){
        res.status(200).json({message: "Actualizacion exitosa"});
    }else{
        res.status(401).json({message: "No autorizado"});
    }
        
    }).
    catch(error =>{
        res.status(500).json({
            message: "No se pudo actualizar el registro"
        });
    });
};

exports.getPosts=(req,res, next)=> {
    console.log(req.query);
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.page;
    const postQuery=Post.find();
    let fetchedPosts;

    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts=documents;
        return Post.count();
    })
    .then(count => {
        res.status(200).json({
            message:'Post obtenidos exitosamente',
            posts: fetchedPosts,
            maxPosts:count
        });
    })
    .catch(error =>{
        res.status(500).json({
            message: "Error al recuperar los registros"
        });
    });
};

exports.getPost=(req, res, next) => {
    Post.findById(req.params.id).then(post =>{
        if (post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: "Post no encontrado"});
        }
    })
    .catch(error =>{
        res.status(500).json({
            message: "Error al recuperar el registro"
        });
    });
};

exports.deletePost=(req, res, next)=> {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
        console.log('Borrando id: ',req.params.id);
        if(result.n>0){
            res.status(200).json({message: "Eliminacion exitosa"});
        }else{
            res.status(401).json({message: "No autorizado"});
        }
    })
    .catch(error =>{
        res.status(500).json({
            message: "Error al eliminar el registro"
        });
    });

}