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
// let notes = [
//     {
//       id: "1",
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: "2",
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: "3",
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     },{
//         id: "5",
//         content: "ET and POST of HTTP protocol",
//         important: false
//       }
//   ]


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
        .then(result => {
            console.log("deleted: ", result)
            response.status(204).end()
        })
        .catch(error => console.log("Encountered error while deleting: ", error))
    
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findById(id)
        .then(note => 
            {
                if (note) {
                    response.json(note)
                }
                else{
                    response.status(404).send()
                }
            }
            )
        .catch(error => {
            console.log("error: ", error)
            response.status(400).send({error: 'malformed id'})
        })
    // const note = notes.find(note => note.id === id)
    // response.statusMessage = "Oops, no such note exists"
    // note === undefined? response.status(404).end() :response.json(note)
    
})


// const generateId = () => {
//     const maxId = notes.length > 0? Math.max(...notes.map(note => Number(note.id))): 0

//     return String(maxId + 1)
// }

app.post('/api/notes', (request, response, next) => {
    const body = request.body
    // if(!body.content){
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response)=> {
    const {content , important} = request.body
    const id = request.params.id
    Note.findById(id)
        .then(note => {
            if (!note){
                return response.status(404).end()
            }
            note.content = content
            note.important = important
            return note.save().then(updatedNote => {
                response.json(updatedNote)
            }).catch(error => console.log("error: ", error))
            
        })

})


const unknownEndpoints = (request, response) => {
    response.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoints)


const errorHandler = (error, request, response, next) => {
    console.log("Error: ", error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({error: "Malformed ID"})
    }
    if (error.name === 'ValidationError'){//occurs if field rules arent followed
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
