import  z  from "zod";

export const CreatUserSchema = z.object({
    username: z.string().min(3).max(200),
    password: z.string().min(3).max(200),
    name: z.string(),
    photo: z.string().optional()
})

export const SigninSchema = z.object({
    username:z.string().min(3).max(200),
    password:z.string().min(3).max(200)
})

export const CreateRoomSchema = z.object({
    room:z.string().min(3).max(20)
})