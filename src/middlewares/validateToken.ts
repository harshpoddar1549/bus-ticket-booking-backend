import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

export const validateToken = async (req: Request, res: Response, next:NextFunction) => {
    let token;
    let authHeader =<String> req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(" ")[1]
        
        process.env.ACCESS_TOKEN_SECRET && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json({
                    message:"User is not Authorized"
                })
                return
            }
            next()
        })
        if(!token){
            res.status(401).json({
                message:"User is not Authorozid or the token in missing from the request"
            })
            return
        }
    }else{
        res.status(400).json({
            message: `Authorization Header missing`
        })
    }
    
}