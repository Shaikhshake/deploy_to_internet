const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const note = require('../models/note')


//wraps app object with supertest func into a super-agent object
const api = supertest(app) 

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


beforeEach(async () => {
    await Note.deleteMany({});
    let noteObj = new Note(initialNotes[0])
    await noteObj.save()
    noteObj = new Note(initialNotes[1])
    await noteObj.save()
})

test('notes are returned as json', async function() {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, initialNotes.length)
})

test('wicked is in there', async () => {
    const response = await api.get('/api/notes')
    console.log(response.body)
    assert(response.body.map(note => note.content).includes("wicked"))
})

after(async function() {
    await mongoose.connection.close()
})