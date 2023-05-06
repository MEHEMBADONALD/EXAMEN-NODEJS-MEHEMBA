const express = require('express')
const session = require('express-session')             
const bodyParser = require('body-parser')              
const examen = require('./outil/BD')                
const app = express()
const port = 3000


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())                             
app.use(bodyParser.urlencoded({ extended: true }))    
app.set('trust proxy', 1)                              
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,maxAge: 604800000,expires: new Date(Date.now() + 604800000)}    
}))


if (app.get('env') === 'production') {
  app.set('trust proxy', 1)                             
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true,maxAge: 604800000,expires: new Date(Date.now() + 604800000)}   

  }))
}



// const routeArticle=require('./routes/article')        
// app.use('',routeArticle)

const routeUser=require('./routes/users')        
app.use('',routeUser)




// PAGE INDEX

app.get('/', (req, res) => {
 
  res.render('pages/index')  
   
})


// PAGE LOGIN

app.get('/login', (req, res) => {
  if (req.session.error) {
    res.locals.error = req.session.error            
    req.session.error =undefined
  }
   if (req.session.idUser) {     
       res.redirect('/compte')
   } else {
       res.render('pages/login')  
   }
})



 // PAGE REGISTER

app.get('/register', (req, res) => {
  if (req.session.error) {
    res.locals.error = req.session.error        
    req.session.error =undefined
  }
  if (req.session.succes) {
    res.locals.succes = req.session.succes     
    req.session.succes =undefined
  }
  if (req.session.email) {
    res.locals.email = req.session.email        
    req.session.email =undefined
  }
  res.render('pages/register')
})


// PAGE CREER


app.get('/creer', (req, res) => {
  if (req.session.error) {
    res.locals.error = req.session.error        
    req.session.error =undefined
  }
  if (req.session.succes) {
    res.locals.succes = req.session.succes     
    req.session.succes =undefined
  }
  res.render('pages/creer')
})

// PAGE ARTICLE

app.get('/mesarticles', (req, res) => {
 
  res.render('pages/mesarticles')  
   
})

// PAGE PROFIL

app.get('/profil', (req, res) => {
 
  res.render('pages/profil')  
   
})


// PAGE UPDATEUSER

app.get('/updateuser', (req, res) => {
 
  res.render('pages/updateuser')  
   
})

 // PAGE ERROR

app.get('*', (req, res) => {
  res.render('pages/error')                              
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})