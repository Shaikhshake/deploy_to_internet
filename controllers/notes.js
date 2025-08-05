const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', async (request, response, next) => {
    const note = await Note.find({})
    response.json(note)
    // Note.find({})
    //     .then(notes => {
    //         response.json(notes)
    //     })
    //     .catch(error => next(error))
})

notesRouter.get("/:id", async (request, response, next) => {

    const note = await Note.findById(request.params.id)

    note? 
        response.json(note)
        :response.status(404).end()


    // Note.findById(request.params.id)
    //     .then(note => {
    //         if (note){
    //             response.json(note)
    //         }
    //         else {
    //             response.status(404).end()
    //         }
    //     })
    //     .catch(error => next(error))
})

notesRouter.post("/", async (request, response, next) => {
    const body = request.body
    const newNote = new Note({
        content: body.content,
        important: body.important || false,
    })

    const savedNote = await newNote.save()
    response.json(savedNote)
    
    // newNote.save()
    //     .then(savedNote => response.json(savedNote))
    //     .catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response, next) => {

    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
    // Note.findByIdAndDelete(request.params.id)
    //     .then(() => {
    //         response.status(204).end()
    //     })
    //     .catch(error => next(error))
})

notesRouter.put("/:id", async  (request, response, next) => {
    const noteID = request.params.id
    const {content, important} = request.body

    const note = await Note.findById(noteID)
    if (!note) return response.status(404).end()
    else {
        note.content = content
        note.important = important || false
        const savedNote = await note.save()
        response.json(savedNote)
    }

    // Note.findById(noteID)
    //     .then(note => {
    //         if (!note){
    //             return response.status(404).end()
    //         }
            
    //         note.content = content
    //         note.important = important || false
            
    //         note.save()
    //             .then(savedNote => {
    //                 response.json(savedNote)
    //             })
    //             .catch(error => next(error))
    //     })
})

module.exports = notesRouter