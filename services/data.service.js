// Import JWT Token
const jwt = require('jsonwebtoken');

// Import DB
const db = require('./db')

// Database
userDetails = {
  1000: { acn: 1000, username: "amal", password: 123, balance: 0, transaction: [] },
  1001: { acn: 1001, username: "anu", password: 123, balance: 0, transaction: [] },
  1002: { acn: 1002, username: "arun", password: 123, balance: 0, transaction: [] },
  1003: { acn: 1003, username: "mega", password: 123, balance: 0, transaction: [] }
}

// Register
// --------
const register = (acn, username, password) => {
  return db.User.findOne({ acn })   //return is given becuase there will be an output ejection after the condition checks
    .then(user => {    //then is used beacuse 2 ports are connecting here. ie, port-3000 with porth-27017
      if (user) {
        return {
          status: false,
          statusCode: 400,
          message: 'User already registered'
        }
      }
      else {
        const newUser = new db.User({
          acn: acn,
          username: username,
          password: password,
          balance: 0,
          transaction: []
        })
        newUser.save();  // data saved in mongo db

        return {
          status: true,
          statusCode: 200,
          message: 'Register successful'
        }
      }
    })
}

// Login
// -----
const login = (acn, password) => {
  return db.User.findOne({ acn, password })
    .then(user => {
      if (user) {
        currentUser = user.username
        currentAcn = acn
        const token = jwt.sign({ currentAcn: acn }, 'superkey2022')
        return {
          status: true,
          statusCode: 200,
          message: 'Login successful',
          token: token,
          currentUser:currentUser,
          currentAcn:acn
        }
      }
      else {
        return {
          status: false,
          statusCode: 400,
          message: 'Invalid credentials'
        }
      }
    })
}

// Deposit
// -------
const deposit = (acn, password, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({ acn, password })
    .then(user => {
      if (user) {
        user.balance += amount
        user.transaction.push({
          type: 'CREDIT',
          amount
        })
        user.save();
        return {
          status: 'true',
          statusCode: 200,
          message: `${amount} is credited in your account & the available balance is ${user.balance} `
        }
      }
      else {
        return {
          status: 'false',
          statusCode: 400,
          message: 'Incorrect userdetailes'
        }
      }
    })
}



// Withdraw
// -----------
const withdraw = (acn, password, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({ acn, password })
    .then(user => {
      if (user) {
        if (user.balance > amount) {
          user.balance -= amount;
          user.transaction.push({
            type: 'DEBIT',
            amount
          })
          user.save();
          return {
            status: true,
            statusCode: 200,
            message: `${amount} is debited from your account & the available balance is ${user.balance} `
          }
        }
        else {
          return {
            status: false,
            statusCode: 400,
            message: 'Invalid userdetailes'
          }
        }
      }
    })
}
//   if (acn in userDetails) {
//     if (psw == userDetails[acn]['password']) {
//       if (amount <= userDetails[acn]['balance']) {
//         userDetails[acn]['balance'] -= amount

//         // Add withdraw detailes in transaction history
//         userDetails[acn]['transaction'].push({ type: 'DEBIT', amount })
//         return {
//           status: 'true',
//           statusCode: 200,
//           message: `${amount} is debited from your account & the available balance is ${userDetails[acn]['balance']} `
//         }
//       }
//       else {
//         return {
//           status: 'false',
//           statusCode: 400,
//           message: 'Insufficient Balance'
//         }
//       }
//     }
//     else {
//       return {
//         status: 'false',
//         statusCode: 400,
//         message: 'Incorrect Password'
//       }
//     }
//   }
//   else {
//     return {
//       status: 'false',
//       statusCode: 400,
//       message: 'Incorrect Acc/No.'
//     }
//   }
// }

// Transaction Detailes
const getTransaction= (acn) => {
  return db.User.findOne({ acn })
    .then(user => {
      if (user) {
        return {
          status: true,
          statusCode: 200,
          transaction: user.transaction
        }
      }
      else {
        return {
          status: false,
          statusCode: 400,
          message: 'User not found'
        }
      }
    })
}

// Delete Account
const deleteAcc=(acn)=>{
 return db.User.deleteOne({acn})
 .then(user=>{
  if(user){
    return {
      status: true,
      statusCode: 200,
      message: 'Account Deleted'
    }
  }
  else{
    return {
      status: false,
      statusCode: 400,
      message: 'User not found'
    }
  }
 })
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc

}