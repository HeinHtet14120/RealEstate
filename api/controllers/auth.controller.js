import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js";

export const register = async ( req, res ) => {
   const { username, email, password } = req.body;

   const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = await prisma.user.create({
    data:{
        username,
        email,
        password: hashedPassword
    }
   })

   console.log(newUser)
}

export const login = ( req, res ) => {
    console.log("login function")
}

export const logout = ( req, res ) => {
    console.log("logout function")
}