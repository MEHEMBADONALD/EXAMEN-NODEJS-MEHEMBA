const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://donaldmehemba237:ntolondjilarachel60@cluster0.v8qgrqq.mongodb.net/?retryWrites=true&w=majority')
mongoose.connect('mongodb://127.0.0.1:27017/examen')
  .then(() => console.log('Connected!'))
  .catch((err) => console.log(err))