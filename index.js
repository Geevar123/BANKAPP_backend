// Server Creation
//  1. Import installed Express-  
// const {request}=require('express')
const express = require('express')

// 1.1 Import dataservice
const dataservices = require('./services/data.service')

// 1.2 Import jwt
const jwt = require('jsonwebtoken')

// 1.3 Import CORS
const cors = require('cors')


//  2. Create an APP using express
const app = express()

// to parse json from request body,
app.use(express.json())  //type conversion

// give command to share data via cors

app.use(cors({
    origin:['http://localhost:4200','http://192.168.45.149:8080']
}))

// Application specific middleware
const appMiddleware = (req, res, next) => {
    console.log('Application specific middleware');
    next();
}
app.use(appMiddleware)

// Router specific middleware
const jwtMiddleware = (req, res, next) => {
    try {
        console.log('Router Specific Middleware');
        const token = req.headers['x-access-token'];
        const data = jwt.verify(token, 'superkey2022')
        console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'PLease Login First'
        })
    }

}

//  3. Create a port number
app.listen(3000, () => {
    console.log('Listening on port 3000');
})

//  4. Resolving HTTP Requests(Get,Post,Put,Patch & Delete)

//  >i< Resolving GET Request:
// app.get('/', (req, res) => {
//     res.send('Get request')
// })

//  >ii< Resolving POST Request:
// app.post('/', (req, res) => {
//     res.send('Post request')
// })

//  >iii< Resolving PUT Request:
// app.put('/', (req, res) => {
//     res.send('Put request')
// })

//  >iv< Resolving PATCH Request:
// app.patch('/', (req, res) => {
//     res.send('Patch request')
// })

//  >V< Resolving DELETE Request:
// app.delete('/', (req, res) => {
//     res.send('Delete request')
// })

// 5. API Request

// i)   Registeration Request

app.post('/register', (req, res) => {
    console.log(req.body);
    dataservices.register(req.body.acn, req.body.username, req.body.password)///data
        .then(result => {
            res.status(result.statusCode).json(result);
        })//access
    //   if(result){
    //     res.send('Register Successful')
    //   }
    //   else{
    //     res.send('User already regsitered')
    //   }
})

// ii)  Login Request

app.post('/login', (req, res) => {
    console.log(req.body);
    dataservices.login(req.body.acn, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// iii) Deposit Request

app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataservices.deposit(req.body.acn, req.body.password, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result);
        })
})

// iv)  Withdraw Request

app.post('/withdraw', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataservices.withdraw(req.body.acn, req.body.password, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result);
        })
})

// v)   Transaction Request

app.post('/transaction', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataservices.getTransaction(req.body.acn)
        .then(result => {
            res.status(result.statusCode).json(result);

        })
})

// vi)  Delete Request
app.delete('/deleteAcc/:acn', (req, res) => {
    dataservices.deleteAcc(req.params.acn)
        .then(result => {
            res.status(result.statusCode).json(result);
        })
})

