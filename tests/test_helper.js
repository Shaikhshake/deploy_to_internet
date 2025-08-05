const Note = require('../models/note')


const initialNotes = [
    {
        content: 'something', 
        important: false, 
        id: '687cd22f766acdeef10ab4fd'
    },
    {
        content: 'wicked', 
        important: true, 
        id: '687cd236766acdeef10ab4ff'
    }
]


const getNonExistingId = async () => {
    const note = new Note({content: "will be deleted soon"})
    await note.save()
    await note.deleteOne()
    return note._id.toString()
}

const getNotesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialNotes, getNonExistingId, getNotesInDb,
}
