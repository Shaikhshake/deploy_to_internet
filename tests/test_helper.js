const Note = require('../models/note')
const User = require('../models/user')


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

const getUsersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialNotes, getNonExistingId, getNotesInDb, getUsersInDb
}
