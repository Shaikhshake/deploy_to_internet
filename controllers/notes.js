const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', (request, response, next) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
        .catch(error => next(error))
})

notesRouter.get("/:id", (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note){
                response.json(note)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

notesRouter.post("/", (request, response, next) => {
    const body = request.body
    const newNote = new Note({
        content: body.content,
        important: body.important || false,
    })
    newNote.save()
        .then(savedNote => response.json(savedNote))
        .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

notesRouter.put("/:id", (request, response, next) => {
    const noteID = request.params.id
    const {content, important} = request.body
    Note.findById(noteID)
        .then(note => {
            if (!note){
                return response.status(404).end()
            }
            
            note.content = content
            note.important = important || false
            
            note.save()
                .then(savedNote => {
                    response.json(savedNote)
                })
                .catch(error => next(error))
        })
})

module.exports = notesRouter