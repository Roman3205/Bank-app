let express = require('express')
let app = express()
let dotenv = require('dotenv')
let path = require('path')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')

dotenv.config({path: path.resolve(__dirname, '../../.env')})

let backPort = process.env.VITE_BACKEND_PORT
let backHost = process.env.VITE_BACKEND_HOST
let frontPort = process.env.FRONTEND_PORT
let frontHost = process.env.FRONTEND_HOST

app.listen(backPort, () => {
    console.log('http://' + backHost + ':' + backPort);
})

let cors = require('cors')

app
    .use(express.json())
    .use(cookieParser())
    .use(cors({
        origin: 'http://' + frontHost + ':' + frontPort,
        credentials: true
    }))


let mongoose = require('mongoose')
let uri = process.env.MONGODB_HOST
mongoose.connect(uri)

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    patronymic: String,
    password: String,
    mail: String,
    cards: [{
        type: mongoose.ObjectId,
        ref: 'card'
    }],
    depositsAll: {
        type: Number,
        min: 0
    },
    expensesAll: {
        type: Number,
        min: 0
    },
    savingsAll: {
        type: Number,
        min: 0
    },
    messages: [{
        type: mongoose.ObjectId,
        ref: 'message'
    }],
    carrierBirth: String
}, {
    timestamps: true
})

let User = mongoose.model('user', userSchema)

let cardMessage = new mongoose.Schema({
    balance: {
        type: Number,
        min: 0
    },
    holdersName: {
        type: String,
        ref: 'user'
    },
    holdersSurname: {
        type: String,
        ref: 'user'
    },
    holdersPatronymic: {
        type: String,
        ref: 'user'
    },
    expirationDate: Date,
    expenses: {
        type: Number,
        min: 0
    },
    uniqueCardNumber: Number,
    transactionsTo: [{
        type: mongoose.ObjectId,
        ref: 'transaction'
    }],
    transactionsFrom: [{
        type: mongoose.ObjectId,
        ref: 'transaction'
    }],
    tel: String,
}, {
    timestamps: true
})

let Card = mongoose.model('card', cardMessage)

let transactionSchema = new mongoose.Schema({
    type: String,
    money: {
        type: Number,
        min: 5
    },
    status: String,
    uniqueNumber: Number,
    sender: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    reciever: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
})

let Transaction = mongoose.model('transaction', transactionSchema)

let messageSchema = new mongoose.Schema({
    question: String,
    answer: String
}, {
    timestamps: true
})

let Message = mongoose.model('message', messageSchema)

let VerifyUser = (req, res, next) => {
    let cookToken = req.headers.cookie
    let newToken = cookToken.split(';')
    let index = newToken.findIndex(elem => elem.includes('user-cookie='))
    let token = newToken[index]

    if(!token) {
        return res.status(401).send('Вы не авторизованы')
    }

    jwt.verify(token.replace(`${process.env.COOKIE_USER}=`, ''), process.env.TOKEN_USER, (error, decoded) => {
        if(error) {
            return res.status(401).send('Вы не авторизованы')
        }

        req.userJWT = decoded._id

        next()
    })
}

let randomCardNumber = () => {
    let min = 2023300050004500
    let max = 2023888899994444

    return Math.floor(Math.random() * (max-min) + min)
}

let createCardNumber = async () => {
    while(true) {
        let number = randomCardNumber()
        let existNumber = await Card.findOne({uniqueCardNumber: number})

        if(!existNumber) {
            return number
        }
    }
}

let randomTransactionNumber = () => {
    let min = 2738193120234325
    let max = 7479464824726374

    return Math.floor(Math.random() * (max-min) + min)
}

let createTransactionNumber = async () => {
    while(true) {
        let number = randomTransactionNumber()
        let existNumber = await Transaction.findOne({uniqueNumber: number})

        if(!existNumber) {
            return number
        }
    }
}

app.post('/registration', async (req,res) => {
    let {name, mail, password} = req.body

    let checkMail = await User.findOne({mail: mail})

    if(checkMail) {
        return res.status(409).send('Аккаунт с введенной почтой уже существует')
    }

    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    let user = new User({
        firstName: name,
        lastName: '',
        patronymic: '',
        password: hashedPassword,
        mail: mail,
        cards: [],
        depositsAll: 0,
        expensesAll: 0,
        savingsAll: 0,
        messages: [],
        carrierBirth: ''
    })

    await user.save()

    res.sendStatus(200)
})

app.post('/login', async (req,res) => {
    let {mail, password} = req.body

    let checkExist = await User.findOne({mail: mail})

    if(!checkExist) {
        return res.status(404).send('Аккаунт пользователя не найден')
    }

    let passwordCheck = await bcrypt.compare(password, checkExist.password)

    if(!passwordCheck) {
        return res.status(400).send('Неверные данные') 
    }

    let token = jwt.sign({_id: checkExist._id}, process.env.TOKEN_USER)
    
    res.cookie(process.env.COOKIE_USER, token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: 'none'
    })

    res.status(200).send(token)
})

app.get('/user/main', VerifyUser, async (req,res) => {
    let user = await User.findOne({_id: req.userJWT}).populate('cards')

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    res.status(200).send(user)
})

app.post('/user/fill', VerifyUser, async (req,res) => {
    let {lastName, patronymic} = req.body

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    user.lastName = lastName
    user.patronymic = patronymic

    await user.save()

    res.sendStatus(200)
})

app.post('/card/create', VerifyUser, async (req,res) => {
    let {name, surname, patronymic, date, tel} = req.body

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    let checkTel = await Card.findOne({tel: tel})

    if(checkTel) {
        return res.status(409).send('Карта с таким привязанным номером телефона уже существует')
    }

    if(user.cards.length >= 5) {
        return res.status(409).send('Нельзя иметь больше 5-ти карт')
    }

    let card = new Card({
        balance: 0,
        holdersName: name,
        holdersSurname: surname,
        holdersPatronymic: patronymic,
        expirationDate: new Date(Date.now() + 365 * 24*3600*1000),
        expenses: 0,
        uniqueCardNumber: await createCardNumber(),
        transactionsTo: [],
        transactionsFrom: [],
        tel: tel,
    })

    await card.save()

    user.carrierBirth = date

    user.cards.push(card._id)

    await user.save()

    res.sendStatus(200)
})

app.post('/logout', async (req,res) => {
    res.clearCookie(process.env.COOKIE_USER)

    res.sendStatus(200)
})