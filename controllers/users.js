const userRouter = require('express').Router()
const User = require("../models/user")
const bcrpyt = require("bcrypt")

userRouter.post("/", async (request, response, next) => {
    const {username, name, password} = request.body

    const saltRounds = 10

    const passwordHash = await bcrpyt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    
    response.status(201).json(savedUser)

    
})

userRouter.get("/", async (request, response, next) => {
    const allUsers = await User.find({})
    response.status(200).json(allUsers)
})

module.exports = userRouter
