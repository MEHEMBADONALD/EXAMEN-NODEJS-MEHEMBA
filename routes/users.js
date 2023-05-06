var express = require('express');
const mongoose = require('mongoose');                
const bcrypt = require('bcrypt');                     
const saltRounds = 10;
const uniqid = require('uniqid');                     
const multer = require('multer')                      
var router = express.Router();                         
const Schema = mongoose.Schema;                       


const userShema = new Schema({                       
  idUser: { type: String, required:true},
  name:{ type: String, required:true},
  prenom:{ type: String, required:true},
  email: { type: String, required:true},
  password:{ type: String, required:true},
  metier:{ type: String, required:true},
  tel:{ type: String, required:true},
  adress:{ type: String, required:true},
  photo: { type: String, required:true},
  description: { type: String, required:true},
});


const userModel = mongoose.model('user', userShema); 
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


// FORMULAIRE DE REGISTER POUR LA CREATION DU COMPTE

router.post('/register',upload.single('file'),function(req, res) {  
  let nom=req.body.nom
  let prenom=req.body.prenom
  let email=req.body.email                               
  let pass=req.body.pass   
  let metier=req.body.metier 
  let tel=req.body.tel  
  let adress=req.body.adress                      
  let file=req.file     
  let comment=req.body.comment                                  

  if (nom=="" || prenom=='' || email=="" || pass=="" || metier=='' || tel=='' || adress=='' || file=="" || comment=='') {    
    req.session.error=true                           
    res.redirect('/register')
  } else{
   
   userModel.find({email:req.body.email})  
      .then((item)=>{
          if (item.length===0){
            let newUser=new userModel({            
              idUser:uniqid(),              
              name:req.body.nom,
              prenom:req.body.prenom,
              email:req.body.email,
              password:bcrypt.hashSync(pass=req.body.pass, saltRounds),  
              metier:req.body.metier,
              tel:req.body.tel,
              adress:req.body.adress,  
              photo:req.file.filename ,
              description:req.body.comment,              
            })
        
            newUser.save()
            .then(() =>{                                        
              req.session.succes=true                
              res.redirect('/register')
            })
            .catch((err) => console.log(err))        

          } else{
            req.session.email=true           
            res.redirect('/register')         
          }
         })
         .catch((err) => console.log(err))
  }
});




// FORMULAIRE DE LOGIN POUR L'UTILISATEUR DE SE CONNECTER A SON COMPTE APRES L'AVOIR CREE

router.post('/login', (req, res) => {
 let email=req.body.email             
 let pass=req.body.pass

 if (email=='' || pass=='') {
  req.session.error=true              
  res.redirect('/login')
 } else{
  userModel.find({email:req.body.email})
  .then((item) =>{                                        
     if (item.length===0) {
      req.session.error=true          
      res.redirect('/login')
     } else{
      if(bcrypt.compareSync(req.body.pass, item[0].password)===true) {   
        req.session.idUser=item[0].idUser        
        res.redirect('/compte')
      } else{
        req.session.error=true        
        res.redirect('/login')
      }
     }
  })
  .catch((err) => console.log(err))     
 }
});


  // PAGE DE VISUALISATION DU PROFIL PAR L'UTILISATEUR

router.get('/compte', (req,res) =>{                 
    userModel.find({idUser:req.session.idUser})   
     .then((item)=>{
        res.render('pages/compte',{user:item[0]})   
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
   
   userModel.find({email:req.body.email})  
      .then((item)=>{
          if (item.length===0){
            let newUser=new userModel({            
              idUser:uniqid(),              
              nom:req.body.nom,
              photo:req.file.filename, 
              description:req.body.comment,           
            })
        
            newUser.save()
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
  userModel.find({idUser:req.session.idUser})   
   .then((item)=>{
      res.render('pages/creer',{user:item[0]})   
   })
  .catch((err) => console.log(err))         
})


// PAGE ARTICLE

router.get('/mesarticles', (req,res) =>{                 
  userModel.find({idUser:req.session.idUser})   
   .then((item)=>{
      res.render('pages/mesarticles',{user:item[0]})   
   })
  .catch((err) => console.log(err))         
})

// PAGE LOGOUT POUR LA DECONNEXION

router.get('/logout', (req,res) =>{   
    req.session.idUser=undefined
    res.redirect('/login')
   
})


 // PAGE DE VISUALISATION DE SES INFOS PAR L'UTILISATEUR AVEC BOUTON MODIFIER

router.get('/profil/:id', (req,res) =>{   
  userModel.find({idUser:req.params.id})      
    .then((item) =>{                                        
      res.render('pages/profil',{user:item[0]})  
    })
    .catch((err) => console.log(err))        
 
})



// PAGE DE MODIFICACATION DES INFORMATIONS

router.get('/updateuser/:id', (req,res) =>{    
 
  if (req.session.error) {
    res.locals.error = req.session.error   
    req.session.error =undefined
  }
  userModel.find({idUser:req.params.id})      
    .then((item) =>{                                        
      res.render('pages/updateuser',{user:item[0]})   
    })
    .catch((err) => console.log(err))              
 
})


// MODIFICATION DES INFOS AVEC BOUTON UPDATE

router.post('/updateuser/:id', (req,res) =>{        
  let nom=req.body.nom
  let prenom=req.body.prenom   
  let email=req.body.email    
  let pass=req.body.pass
  let metier=req.body.metier  
  let tel=req.body.tel 
  let adress=req.body.adress  
  let file=req.body.file  
  let comment=req.body.comment                               
                                                        

  if (nom=="" || prenom==""|| email=="" || pass=="" || metier=="" || tel=="" || adress=="" || file=="" || comment=="") {    
    req.session.error=true                               
    res.redirect('/updateuser/'+req.params.id)  
  } else{
    userModel.updateOne({idUser:req.params.id},{email:req.body.email,
      name:req.body.nom,
      prenom:req.body.prenom,
      password:req.body.pass,
      metier:req.body.metier,
      tel:req.body.tel,
      adress:req.body.adress,
      photo:req.file,
      description:req.body.comment})       
    .then((item) =>{                                        
      res.redirect('/profil/'+req.params.id)    
    })
    .catch((err) => console.log(err))              
  }
})

