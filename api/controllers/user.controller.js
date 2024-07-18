import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get users !" })
    }
}

export const getUser = async (req, res) => {

    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get user !" })
    }
}

export const updateUser = async (req, res) => {

    const id = req.params.id;
    const userTokenID = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (!id == userTokenID) {
        return res.status(403).json({ message: "Not Authorized !" });
    }

    let updatePassword = null;

    try {

        if (password) {
            updatePassword = await bcrypt.hash(password, 10);
        }
        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatePassword && { password: updatePassword }),
                ...(avatar && { avatar }),
            },
        });

        console.log(updateUser);

        const { password: userPassword, ...rest } = updateUser

        res.status(200).json(rest)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to update user !" })
    }
}

export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const userTokenID = req.userId;

    if (!id == userTokenID) {
        return res.status(403).json({ message: "Not Authorized !" });
    }

    try {

        await prisma.user.delete({
            where: { id }
        });

        res.status(200), json({ message: "User deleted !" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to delete user !" })
    }
}


export const savePost = async (req, res) => {

    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {

        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                }
            });

            res.status(200).json({ message: "Post removed from saved list !" })

        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                }
            });

            res.status(200).json({ message: "Post saved !" })

        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to delete user !" })
    }
}