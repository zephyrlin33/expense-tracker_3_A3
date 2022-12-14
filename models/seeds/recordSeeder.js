const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const Expense = require('../expense.js')
const User = require('./../user')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

const SEED_USER = [{
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
}]


const SEED_RECORD = [
    { name: '午餐', date: '2022-4-23', number: 60, categoryId: 4 },
    { name: '晚餐', date: '2022-4-23', number: 60, categoryId: 4 },
    { name: '公車', date: '2022-4-24', number: 120, categoryId: 2 },
    { name: '租金', date: '2022-4-1', number: 20000, categoryId: 1 },
    { name: '電影', date: '2022-4-23', number: 200, categoryId: 3 }
]


db.once('open', () => {
    console.log('mongodb connected!')
    console.log('Creating records.....')
    SEED_USER.map(x => {
        x.password = bcrypt.hashSync(x.password, 10)
        return x
    })
    User.create(SEED_USER)
        .then((user) => {
            console.log('新增的user資料',user[0])
            const userId = user[0]._id
            Promise.all(Array.from({ length: 5 },
                (_, i) => {
                    SEED_RECORD[i].userId = userId
                }
            ))
            return Expense.create(SEED_RECORD)

        })
        .then(() => {
            console.log('recordSeeder.js is done.')
            process.exit()
        })
        .catch(err => console.log(err))


})