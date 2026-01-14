// This is added to remove red squiggly line from userId written with req
declare global{
    namespace Express{
        interface Request{
            userId?: string
        }
    }
}

import { NextFunction, Request, Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

// This is also written to remove red squiggly line from userId written with decoded
interface AuthJwtPayload extends JwtPayload{
    userId:string
}


export function authMiddleware(req:Request, res:Response, next:NextFunction){
    const token = req.headers["authorization"]

    if(!token){
        return res.status(401).json({
            message: "Token not received"
        })
    }

    try{ 
        const decoded = jwt.verify(token, JWT_SECRET!) as AuthJwtPayload
        req.userId = decoded.userId
        next()
    }catch {
        return res.status(401).json({
            message:"Invalid token / Unauthorized"
        })
    }
}