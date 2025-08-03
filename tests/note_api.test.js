const {test, after} = require('node:test')
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
        // .end(function(err, res) {
        //     if (err) console.log(err)
        //     // else console.log(res)
        // })
})

after(async function() {
    await mongoose.connection.close()
})