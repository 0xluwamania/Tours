import dotEnv from 'dotenv';
import mongoose from 'mongoose'
import app from './app';
import {DB} from './env'

dotEnv.config();

// const DB = process.env.DATABASE

    const connection = async() => {
        try{
            const isConnected = await mongoose.connect("mongodb+srv://ade:KOAgLkc9Tv07NlfE@cluster0.5nbpw.mongodb.net/natour?retryWrites=true&w=majority")
            console.log('connected')
            return isConnected
        } catch(err:any){
            console.log(err)
            throw new Error(err);
        }
    }
    connection()

const port = process.env.PORT || 3200;

app.listen(port, ()=> {
console.log(`app is listening on PORT: ${port}...`)
})
