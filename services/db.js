// Server Creation- Mongo DB Integration in command prompt using - mpm i mongoose

// 1) Import mongoose

const mongoose = require('mongoose');

// 2) State connection string via mongoose


mongoose.connect('mongodb://127.0.0.1/BankServerAug',
{
    useNewUrlParser: true     // to avoid unvanted warnings
});
  

// 3) Define Bank DB Model

const User = mongoose.model('User',
    {
        //Schema Creation
        acn: Number,
        username: String,
        password: String,
        balance: Number,
        transaction: []
    });

// 4) Export collection

module.exports={
    User
}


