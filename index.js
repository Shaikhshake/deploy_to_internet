const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log("Method: ", request.method)
    console.log("Path: ", request.path)
    console.log("Body: ", request.body)
    console.log("---")
    next()
}
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

const Note = require('./models/notes')
let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    },{
        id: "5",
        content: "ET and POST of HTTP protocol",
        important: false
      }
  ]


app.get('/', (request, response) => {
    // console.log('request from /: ', Object.keys(request))
    response.send('<h1>Hello worlssd</h1>')
})

app.get('/api/notes', (request, response) => {
    // console.log('request from /api/notes: ', Object.keys(request))
    Note.find({})
        .then(notes => response.json(notes))
        .catch(error => console.log("error: ", error))
    // response.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(result => console.log("deleted: ", result))
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    response.statusMessage = "Oops, no such note exists"
    note === undefined? response.status(404).end() :response.json(note)
    
})


const generateId = () => {
    const maxId = notes.length > 0? Math.max(...notes.map(note => Number(note.id))): 0

    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => console.log("error: ", error))
})

app.put('/api/notes/:id', (request, response)=> {
    console.log("request.body:", request.params)
    const id = request.params.id
    Note.findByIdAndUpdate(
        id,
        {$bit: {important: {xor : 1}}}
    )
    const noteTobeChanged = notes.find(note => note.id === request.params.id)
    if(noteTobeChanged === undefined){
        return response.status(404).send({error: "No such note exists"})
    }
    const newNote = {
        id: noteTobeChanged.id,
        content: noteTobeChanged.content,
        important: !noteTobeChanged.important
    }
    notes = notes.map(note => note.id === noteTobeChanged.id? newNote : note)
    response.json(newNote)

})


const unknownEndpoints = (request, response) => {
    response.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoints)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
