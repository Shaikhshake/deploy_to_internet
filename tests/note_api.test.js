const {test, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require('supertest')
const app = require('../app')

//wraps app object with supertest func into a super-agent object
const api = supertest(app) 

test('notes are returned as json', async function() {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, 2)
})

test('wicked is in there', async () => {
    const response = await api.get('/api/notes')
    console.log(response.body)
    assert(response.body.map(note => note.content).includes("wicked"))
})

after(async function() {
    await mongoose.connection.close()
})