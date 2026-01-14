import express from "express"
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware"
import { CreateRoomSchema, CreatUserSchema, SigninSchema } from "@repo/common/zodSchema"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"
import console, { error } from "node:console"

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {

    const result = CreatUserSchema.safeParse(req.body)
    if (!result.success) {
        return res.json({
            message: "Incoorect input credentials"
        })
    }
    const { username, password, name, photo } = result.data

    const existingUser = await prismaClient.user.findUnique({
        where: { email: username }
    })
    if (existingUser) {
        return res.status(401).json({
            message: "User is already exist with this email"
        })
    }

    try {
        const hashedPass = await bcrypt.hash(password, 10)

        const user = await prismaClient.user.create({
            data: {
                email: username,
                password: hashedPass,
                name,
                photo
            }
        })

        res.json({
            userId: user.id,
            message: "User Created Successfully"
        })
    } catch (e: any) {
        return res.status(411).json({
            message:"Something went wrong", 
            error: e.message   
        })
    }

})

app.post('/signin', async (req, res) => {

    const parrsed = SigninSchema.safeParse(req.body)

    if (!parrsed.success) {
        return res.status(411).json({
            message: "Invalid input type"
        })
    }

    const { username, password } = parrsed.data

    const user = await prismaClient.user.findUnique({
        where: {
            email: username
        }
    })

    if (!user) {
        return res.status(401).json({
            message: "User with this email is not exist"
        })
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        return res.status(500).json({
            message: "Entered password is not correct. Please Enter correct password"
        })
    }

    const userId = user.id
    const token = jwt.sign({
        userId
    }, JWT_SECRET!)

    res.json({
        token
    })
})

app.post('/room', authMiddleware, async (req, res) => {
    
    const parrsed = CreateRoomSchema.safeParse(req.body)
    if(!parrsed.success){
        return res.json({
            message:"Incorrect inputs"
        })
    }

    const userId = req.userId
    if(!userId){
        return res.json({
            message:"authentication is failed"
        })
    }

    const isValid = await prismaClient.room.findUnique({
        where:{
            slug:parrsed.data.room
        }
    })

    if(isValid){
        return res.status(411).json({
            message:"Room with this name is already exist, try another name"
        })
    }

    const room = await prismaClient.room.create({
        data:{
            slug: parrsed.data.room,
            adminId: userId,
        }
    })

    res.json({
        rooId: room.id
    })
})

app.listen(4000)