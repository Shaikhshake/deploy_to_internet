const userRouter = require('express').Router()
const User = require("../models/user")
const bcrpyt = require("bcrypt")

userRouter.post("/", async (request, response, next) => {
    
    try{    
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
    }
    catch(exception) {
        next(exception)
    }

    
})

userRouter.get("/", async (request, response, next) => {
    const allUsers = await User
        .find({})
        .populate('notes', {content: 1, important:1})
    response.status(200).json(allUsers)
})

module.exports = userRouter
