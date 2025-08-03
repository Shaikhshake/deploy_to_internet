const mongoose = require('mongoose')
const config = require('./utils/config')


const url = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url).then(()=> console.log("connected to test db: ", url)).catch(error => console.log(error))


const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})


const Note = mongoose.model("Note", noteSchema)


const note1 = new Note({
    content: "HTML is Easy",
    important: true,

})
const note2 = new Note({
    content:"wicked",
    important: false,
})

note1.save().then(result => {
    console.log('Note Saved!-> result: ', result)
}).catch(error => console.log(error))

note2.save().then(result => {
    console.log('Note Saved!-> result: ', result)
    mongoose.connection.close()
}).catch(error => console.log(error))
// Note.find({})
//     .then(result => {
//         result.forEach(note => console.log(note));
//         mongoose.connection.close();
//     })
//     .catch(error => console.log("Error: ", error))