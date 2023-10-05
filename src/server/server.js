let express = require('express')
let app = express()
let dotenv = require('dotenv')
let path = require('path')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')
let openAI = require("openai")
let dayjs = require('dayjs')
let nodemailer = require('nodemailer')

dotenv.config({path: path.resolve(__dirname, '../../.env')})

let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    // service: 'gmail',
    auth: {
        user: process.env.YANDEX_MAIL,
        pass: process.env.YANDEX_PASSWORD
    }
})

let backPort = process.env.VITE_BACKEND_PORT
let backHost = process.env.VITE_BACKEND_HOST
let frontPort = process.env.FRONTEND_PORT
let frontHost = process.env.FRONTEND_HOST

app.listen(backPort, () => {
    console.log('http://' + backHost + ':' + backPort);
})

let cors = require('cors')

let openai = new openAI({
    apiKey: process.env.OPENAI_KEY
})
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
    transactions: [{
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
    senderCard: Number,
    reciever: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    recieverCard: Number,
    pathNum: String,
    codeNum: String
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

    if(!cookToken) {
        return res.status(401).send('Вы не авторизованы')
    }

    let newToken = cookToken.split(';')
    let index = newToken.findIndex(elem => elem.includes('user-cookie='))
    let token = newToken[index]

    jwt.verify(token.trim().replace(`${process.env.COOKIE_USER}=`, ''), process.env.TOKEN_USER, (error, decoded) => {
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

let createNumber = async () => {
    while(true) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for(i = 0; i < 50; i++) {
            let randomNumber = Math.floor(Math.random() * characters.length)
            result += characters.charAt(randomNumber)
        }

        let existNumber = await Transaction.findOne({pathNum: result})

        if(!existNumber) {
            return result
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
    let user = await User.findOne({_id: req.userJWT}).select('_id firstName lastName patronymic mail cards depositsAll expensesAll savingsAll messages carrierBirth').populate({
        path: 'cards',
        options: {
            sort: {
                createdAt: -1
            }
        },
        select: '_id balance holdersName holdersSurname holdersPatronymic expirationDate uniqueCardNumber transactionsTo transactionsFrom'
    })

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

    if(date != user.carrierBirth) {
        return res.status(409).send('Вы указали дату рождения, отличную от той, которую вы указывали при создании первой карты')
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

app.get('/card/get', VerifyUser, async (req,res) => {
    let {cardNumber} = req.query

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    let card = await Card.findOne({uniqueCardNumber: cardNumber}).select('_id balance holdersName holdersSurname holdersPatronymic expirationDate uniqueCardNumber transactionsTo transactionsFrom')

    if(user.cards.indexOf(card._id) < 0) {
        return res.status(409).send('Запрашиваемая карта вам не принадлежит')
    }

    if(!card) {
        return res.status(409).send('Карта не найдена')
    }

    res.status(200).send(card)
})

app.post('/card/delete', VerifyUser, async (req,res) => {
    let {cardId} = req.body

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    // let card = await Card.findOneAndDelete({_id: cardId})
    let card = await Card.findOne({_id: cardId})

    if(!card) {
        return res.status(409).send('Карта не найдена')
    } else if (card.balance > 0) {
        return res.status(409).send('Баланс карты не равен нулю')
    }

    await card.deleteOne()

    let index = user.cards.indexOf(card._id)

    if(index != -1) {
        user.cards.splice(index, 1)
        await user.save()
    } else {
        return
    }

    res.sendStatus(200)
})

app.post('/transaction/create', VerifyUser, async (req,res) => {
    let {money, fromCard, toCard} = req.body

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }    

    let cardFrom = await Card.findOne({uniqueCardNumber: fromCard})
    let cardTo = await Card.findOne({uniqueCardNumber: toCard})

    if(!cardFrom || !cardTo) {
        return res.status(409).send('Карта получателя не найдена')
    } else if(!user.cards.includes(cardFrom._id)) {
        return res.status(409).send('Карта, с которой вы переводите деньги, вам не принадлежит')
    } else if(String(cardFrom._id) === String(cardTo._id)) {
        return res.status(409).send('Нельзя перевести деньги на свою же карту')
    } else if(money > cardFrom.balance) {
        return res.status(409).send('Недостаточно средств на балансе карты')
    }

    let number = Math.floor(Math.random() * (999999-111111) + 111111)

    let mailOptions = {
        from: process.env.YANDEX_MAIL,
        to: `${user.mail}`,
        subject: 'МикроБанк',
        // text: `С вашего аккаунт будет совершена операция по переводу\n Если это сделали не вы - не переходите по ссылке \n ${number}`
        html: `
        <p>С вашего аккаунта будет совершена операция по переводу.</p>
        <p>Если это сделали не вы, пожалуйста, проигнорируйте данное письмо.</p>
        <span>Код подтверждения:</span> <strong><h3>${number}</h3></strong>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(409).send('Произошла ошибка с отправкой кода подтверждения: ' + error);
        }
    })

    let salt = await bcrypt.genSalt(10)
    let codeNum = await bcrypt.hash(String(number), salt)
    
    let sender = await User.findOne({cards: {$elemMatch: {$eq: String(cardFrom._id)}}})
    let reciever = await User.findOne({cards: {$elemMatch: {$eq: String(cardTo._id)}}})

    if(!reciever || !sender) {
        return res.status(409).send('Получатель не найден')
    }

    let path = await createNumber()

    let transaction = new Transaction({
        type: 'waiting-for-shifting',
        money: money,
        uniqueNumber: await createTransactionNumber(),
        sender: sender._id,
        senderCard: Number(cardFrom.uniqueCardNumber),
        reciever: reciever._id,
        recieverCard: Number(cardTo.uniqueCardNumber),
        pathNum: path,
        codeNum: codeNum
    })

    await transaction.save()

    res
        .status(200)
        .send({oplata: path})
})

app.get('/oplata/get', VerifyUser, async(req,res) => {
    let {path} = req.query

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    let transaction = await Transaction.findOne({pathNum: path}).select('type money createdAt recieverCard')

    if(!transaction) {
        return res.status(409).send('Транзакции не существует')
    }

    res.status(200).send(transaction)
})

app.post('/transaction/accept', VerifyUser, async(req,res) => {
    let {code, path} = req.body

    let user = await User.findOne({_id: req.userJWT})

    if(!user) {
        return res.status(401).send('Вы не авторизованы')
    }

    let transaction = await Transaction.findOne({pathNum: path})

    if(!transaction) {
        return res.status(409).send('Транзакции не существует')
    }

    let operationDate = dayjs(transaction.createdAt)
    let now = dayjs()

    let difference = now.diff(operationDate, 'seconds')
    if(difference > 600) {
        return res.status(409).send('Операция больше недействительна, так как время на ввод кода закончилось')
    }

    let check = await bcrypt.compare(code, transaction.codeNum)

    if(!check) {
        return res.status(409).send('Код подтверждения не подходит')
    }

    let senderCardNum = await Card.findOne({uniqueCardNumber: transaction.senderCard})
    let recieverCardNum = await Card.findOne({uniqueCardNumber: transaction.recieverCard})

    if(!recieverCardNum || !senderCardNum) {
        return res.status(409).send('Получатель не найден')
    }
    
    let sender = await User.findOne({cards: {$elemMatch: {$eq: String(senderCardNum._id)}}})
    let reciever = await User.findOne({cards: {$elemMatch: {$eq: String(recieverCardNum._id)}}})

    if(!reciever || !sender) {
        return res.status(409).send('Получатель не найден')
    }

    senderCardNum.balance = Number(senderCardNum.balance) - Number(transaction.money)
    senderCardNum.expenses = Number(senderCardNum.expenses) + Number(transaction.money)
    recieverCardNum.balance = Number(recieverCardNum.balance) + Number(transaction.money)
    senderCardNum.transactions.push(transaction._id)
    recieverCardNum.transactions.push(transaction._id)

    await senderCardNum.save()
    await recieverCardNum.save()

    sender.expensesAll = Number(sender.expensesAll) + Number(transaction.money)
    reciever.depositsAll = Number(reciever.depositsAll) + Number(transaction.money)

    await sender.save()
    await reciever.save()

    transaction.type = 'shifting'
    transaction.pathNum = null
    transaction.codeNum = null

    await transaction.save()

    res.sendStatus(200)
})











// app.post('/ask', VerifyUser, async(req,res) => {
//     let {prompt} = req.body

//     let response = await openai.chat.completions.create({
//         "model": "gpt-3.5-turbo-0613",
//         "message": [
//             {"role": "assistant",
//             "content": "\n\nThis is a test!"}
//         ]
//     })

//     console.log(response);

//     res.send(response.choices[0].message)
// })

app.post('/logout', async (req,res) => {
    res.clearCookie(process.env.COOKIE_USER)
    
    res.sendStatus(200)
})