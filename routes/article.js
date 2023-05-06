var express = require('express');
const mongoose = require('mongoose');                
const bcrypt = require('bcrypt');                     
const saltRounds = 10;
const uniqid = require('uniqid');                     
const multer = require('multer')                      
var router = express.Router();                         
const Schema = mongoose.Schema;                       


const articleShema = new Schema({                       
  idArticle: { type: String, required:true},
  name:{ type: String, required:true},
  photo: { type: String, required:true},
  description: { type: String, required:true},
});


const articleModel = mongoose.model('article', articleShema); 
module.exports = router;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')                
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() +file.originalname)    
  }
})


const upload = multer({ 
  storage: storage,
  limits:{
      fieldSize:1024*1024*3                    
  },
  fileFilter:(req, file, cb) =>{
     if (
      file.mimetype=='image/apng' ||
      file.mimetype=='image/avif' ||           
      file.mimetype=='image/gif' ||
      file.mimetype=='image/jpeg' ||           
      file.mimetype=='image/png' ||
      file.mimetype=='image/svg+xml' ||
      file.mimetype=='image/webp'
     ) {
       cb(null,true)
     }else{
      cb(null,false)
      cb(new Error('uniquement les Fichiers Images'))
     }
  }
 })


  // PAGE DE VISUALISATION DU PROFIL PAR L'UTILISATEUR

router.get('/article', (req,res) =>{                 
    articleModel.find({idArticle:req.session.idArticle})   
     .then((item)=>{
        res.render('pages/article',{user:item[0]})   
     })
    .catch((err) => console.log(err))         
})


// FORMULAIRE DE CREER POUR L'ARTICLE

router.post('/creer',upload.single('file'),function(req, res) {  
  let nom=req.body.nom                     
  let file=req.file   
  let comment=req.body.comment  
                                 

  if (nom=="" ||  file==""  || comment=="") {    
    req.session.error=true                           
    res.redirect('/creer')
  } else{
   
   articleModel.find({email:req.body.email})  
      .then((item)=>{
          if (item.length===0){
            let newArticle=new articleModel({            
              idArticle:uniqid(),              
              nom:req.body.nom,
              description:req.body.comment,
              photo:req.file.filename,            
            })
        
            newArticle.save()
            .then(() =>{                                        
              req.session.succes=true                
              res.redirect('/creer')
            })
            .catch((err) => console.log(err))        

          } 

         })
         .catch((err) => console.log(err))
  }
});



router.get('/creer', (req,res) =>{                 
  articleModel.find({idArticle:req.session.idArticle})   
   .then((item)=>{
      res.render('pages/creer',{article:item[0]})   
   })
  .catch((err) => console.log(err))         
})

// PAGE ARTICLE

router.get('/mesarticles', (req,res) =>{                 
  articleModel.find({idArticle:req.session.idArticle})   
   .then((item)=>{
      res.render('pages/mesarticles',{article:item[0]})   
   })
  .catch((err) => console.log(err))         
})

// PAGE LOGOUT POUR LA DECONNEXION

// router.get('/logout', (req,res) =>{   
//     req.session.idArticle=undefined
//     res.redirect('/login')
   
// })


 // PAGE DE VISUALISATION DE SES INFOS PAR L'UTILISATEUR AVEC BOUTON MODIFIER

// router.get('/profil/:id', (req,res) =>{   
//   articleModel.find({idArticle:req.params.id})      
//     .then((item) =>{                                        
//       res.render('pages/profil',{article:item[0]})  
//     })
//     .catch((err) => console.log(err))        
 
// })



// PAGE DE MODIFICACATION DES INFORMATIONS

// router.get('/updateuser/:id', (req,res) =>{    
 
//   if (req.session.error) {
//     res.locals.error = req.session.error   
//     req.session.error =undefined
//   }
//   articleModel.find({idArticle:req.params.id})      
//     .then((item) =>{                                        
//       res.render('pages/updateuser',{article:item[0]})   
//     })
//     .catch((err) => console.log(err))              
 
// })


// MODIFICATION DES INFOS AVEC BOUTON UPDATE

// router.post('/updateuser/:id', (req,res) =>{        
//   let nom=req.body.nom  
//   let file=req.body.file  
//   let comment=req.body.comment                               
                                                        

//   if (nom=="" || file=="" || comment=="") {    
//     req.session.error=true                               
//     res.redirect('/updateuser/'+req.params.id)  
//   } else{
//     articleModel.updateOne({idArticle:req.params.id},{name:req.body.nom,
//       photo:req.file,
//       description:req.body.comment})       
//     .then((item) =>{                                        
//       res.redirect('/profil/'+req.params.id)    
//     })
//     .catch((err) => console.log(err))              
//   }
// })