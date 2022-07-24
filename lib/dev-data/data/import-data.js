
const path = require('path');
const fs = require('fs')
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const {Tour} = require('./../../models/tourModels')


dotEnv.config();

// const DB = process.env.DATABASE

    const connection = async() => {
        try{
            const isConnected = await mongoose.connect("mongodb+srv://ade:KOAgLkc9Tv07NlfE@cluster0.5nbpw.mongodb.net/natour?retryWrites=true&w=majority")
            console.log('connected')
            return isConnected
        } catch(err){
            console.log(err)
            throw new Error(err);
        }
    }
    connection();

    const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf-8'))

    const importData = async ()=> {
        try {
            await Tour.create(tours);
            console.log('Data successfully uploaded')
        } catch (error) {
            console.log(error)
        }
        process.exit()
    }

    const deleteData = async () => {
        try {
            await Tour.deleteMany();
            console.log('data successfully deleted')
        } catch (error) {
            console.log(error)
        }
        process.exit()
    }
    if(process.argv[2]=== '--import'){
        importData()
    }else if(process.argv[2] === '--delete'){
        deleteData()
    }
   