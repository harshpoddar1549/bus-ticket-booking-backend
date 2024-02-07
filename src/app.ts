import express from 'express'
import dotenv from 'dotenv'
import { connectToDb } from './middlewares/connectToDb'
import busRouter from './routes/bus.route'
import adminRouter from './routes/admin.route'
import bookingRouter from './routes/booking.route'


// init express server
const app = express()

//dotenv config
dotenv.config()

// for body parsing
app.use(express.json())

//connect to Db
connectToDb().then(()=> {
    //listening to port
    app.listen(process.env.PORT, () => console.log(`Server listening at PORT ${process.env.PORT}`))
}).catch((err) => {
    console.log(err)
    process.exit(1)
})


// initializing routes
app.use('/bus', busRouter)
app.use('/admin', adminRouter)
app.use('/ticket', bookingRouter)
