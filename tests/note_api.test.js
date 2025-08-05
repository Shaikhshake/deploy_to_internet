const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const note = require('../models/note')
const {initialNotes, getNonExistingId, getNotesInDb, } = require('./test_helper')



//wraps app object with supertest func into a super-agent object
const api = supertest(app) 


beforeEach(async () => {
    await Note.deleteMany({});

    const noteObj = initialNotes.map(note => new Note(note))
    //noteobj.save returns a promise immediately
    const promiseArray = noteObj.map(noteObj => noteObj.save())
    

    //Promise.all(iterable) takes an iterable(arrays of promises usually) and returns a new promise which is only resolved when all of them  are resolved.
    try {
        await Promise.all(promiseArray)
    }
    catch (exception){
        console.log("HEREES THE EXCEPPPPPPTTTTTTTTTTTTIONONONONONOOONONO:::", exception)
    }
    

    //This code below wont work as each iteration of foreach
    //loop is a another synchronous operation and beforeEach
    //doesn't wait for them to end.
    // initialNotes.forEach(async (note) => {
    //     let noteObj = new Note(note)
    //     try {
    //         await noteObj.save()
    //     }
    //     catch(exception){
    //         next(exception)
    //     }
    // })
    // let noteObj = new Note(initialNotes[0])
    // await noteObj.save()
    // noteObj = new Note(initialNotes[1])
    // await noteObj.save()
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

test('new note can be added', async () => {
    const newNote = {
        content: "async/await is cleaner",
        important: true,
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    
    const notesAtEndOfPost = await getNotesInDb()
    const contents = notesAtEndOfPost.map(note => note.content)
    assert(contents.includes("async/await is cleaner"))
    assert.strictEqual(notesAtEndOfPost.length, initialNotes.length+1)

})

test("empty note cannot be added", async () => {
    const emptyNote = new Note({important: true})
    
    await api
        .post('/api/notes')
        .send(emptyNote)
        .expect(400)
    
    const notesAtEndOfPost = await getNotesInDb()
    assert.strictEqual(notesAtEndOfPost.length, initialNotes.length)

})


after(async function() {
    await mongoose.connection.close()
})