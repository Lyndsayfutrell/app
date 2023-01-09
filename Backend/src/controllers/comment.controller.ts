import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../db/prisma.client";
import CustomError from "../middlewears/custom-error";
import { handleCreateComment, handleDeleteComment, handleGetComment, handleGetComments } from "../services/comment.service";

interface Req extends Request {
    user: {
        id: string
        role: Role
        profilePictureId?: string
    },
    query: {
        title?: string 
        jump?: string 
        limit?: string 
        category?: string 
        username?: string
        email?: string
        role?: {

        }
        roleId?: string
    },
    params: {
        id: string
    }
}

export const getComment = async (req: Request, res: Response) => {
    const { params: { id } } = req

    const comment = await handleGetComment(id)
    res.json({ message: "success", data: comment }).status(StatusCodes.OK)
}

export const getComments = async (req: Request, res: Response) => {
    // TODO: add support for query parameters.
    const comment = await handleGetComments()
    res.json({ count: comment.length, data: comment })
}

export const createComment = async (req: Req, res: Response) => {
    const { body: { postId, content }, user: { id: userId, role: { isAdmin, canCreateComment } } } = req

    if (!postId) throw new CustomError("postId is required.", StatusCodes.BAD_REQUEST)
    if (!content) throw new CustomError("content is required.", StatusCodes.BAD_REQUEST)

    if (!(isAdmin || canCreateComment)) throw new CustomError("You do not have permission to create a comment.", StatusCodes.UNAUTHORIZED)
    const comment = await handleCreateComment({ postId, content, userId })

    res.json({ message: "success", data: comment })
}

export const deleteComment = async (req: Req, res: Response) => {
    const comment = await handleDeleteComment(req)
    res.json({ message: "success" }).status(StatusCodes.OK)
}