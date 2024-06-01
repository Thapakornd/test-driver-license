import express from 'express'
import * as dotenv from 'dotenv'
import connectDb from './configs/connectDb.js'
import { addUser, getAllUser, updateUser, getUserByDate, delUser  } from './controllers/user.controller.js'

dotenv.config()

const app = express()
const PORT = 8000

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json({
        "message": "the server is running!"
    })
})

app.get('/user', getAllUser)
app.post('/user/add', addUser)
app.get('/user/date', getUserByDate)
app.put('/user/update/:id', updateUser)
app.delete('/user/delete/:id', delUser)

const startServer = async () => {
    try {
        connectDb(process.env.ATLAS_URL)
        app.listen(PORT, () => {
            console.log(`Server is running on port : ${PORT}`)
        })
    } catch (error) {
        throw new Error(error)
        console.log(error)
    }
}

startServer()