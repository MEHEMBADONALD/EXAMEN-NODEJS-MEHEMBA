var pass=document.getElementById('pass')
var check=document.getElementById('check')
var bouton=document.querySelector('button')
var formulaire=document.querySelector('form')
var icon=document.querySelector('i')


// POUR QUE LE MOT DE PASSE SE VOIT

check.addEventListener('click',function(){
    var attr=pass.getAttribute('type')

    if (attr==='password') {
        pass.setAttribute('type','text')
    } else {
      pass.setAttribute('type','password')  
    }
})


