const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const {
    initialNotes, 
    getNonExistingId, 
    getNotesInDb, 
    getUsersInDb } = require('./test_helper')


const User = require('../models/user')




//wraps app object with supertest func into a super-agent object
const api = supertest(app) 


beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(initialNotes)

    // const noteObj = initialNotes.map(note => new Note(note))
    // //noteobj.save returns a promise immediately
    // const promiseArray = noteObj.map(noteObj => noteObj.save())
    

    // //Promise.all(iterable) takes an iterable(arrays of promises usually) and returns a new promise which is only resolved when all of them  are resolved.
    // try {
    //     await Promise.all(promiseArray)
    // }
    // catch (exception){
    //     console.log("HEREES THE EXCEPPPPPPTTTTTTTTTTTTIONONONONONOOONONO:::", exception)
    // }
    

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


    //Code below will absolutely work
    // for (let note of helper.initialNotes) {
    //     let noteObject = new Note(note)
    //     await noteObject.save()
    // }
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
    const dummyUser = {
        username: "test",
        name: "test",
        password: "test"
    }

    const newUser = new User(dummyUser)
    const result = await newUser.save()
    console.log("RESULTTTTSSSS: ", result)
    const newNote = {
        content: "async/await is cleaner",
        important: true,
        userId: result._id
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


describe("when there are no users in DB", async () => {
    beforeEach( async () => {
        await User.deleteMany({})
    })

    test("One user with userName is root can be added", async () => {
        const dummy1 = {
            username: 'root',
            name: 'Superuser',
            password: 'hiya'
        }

        const result = await api
            .post('/api/users')
            .send(dummy1)
            .expect(201)
            .expect("Content-Type", /application\/json/)
    })

    test("cannot add user with the same name", async () => {

        

        const dummy1 = {
            username: 'root',
            name: 'Superuser',
            password: 'hiya'
        }
        const result = await api
            .post('/api/users')
            .send(dummy1)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        
            
        const usersAtStart = await getUsersInDb()

        const dummy2 = {
            username: 'root',
            name: 'notme',
            password: 'kyeee'
        }

        const newResult = await api
            .post('/api/users')
            .send(dummy2)
            .expect(400)
            .expect("Content-Type", /application\/json/)


        const usersAtEnd = await getUsersInDb()
        assert(newResult.body.error.includes("Expected `username` to be unique"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async function() {
    await mongoose.connection.close()
})