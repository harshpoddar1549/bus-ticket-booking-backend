import { Request, Response } from "express"
import adminModel from "../models/admin.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { resetBus, resetPlatform } from "../utils/utils";
import { AdminService } from "../services/admin.service";

export const adminController = {
    registerAdmin: async (req:Request, res:Response) => {
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).json({
                message: "All fields are mandatory"
            })
            //throw new Error("All fields are mandatory")
        }
        const userAvail = await adminModel.findOne({ email: email })
        if(userAvail){
            res.status(400).json({
                message: "User already registered"
            })
            //throw new Error("User already registered")
        }

        // create a Hashed pwd
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await adminModel.create({
            email,
            password: hashedPwd
        })
        if(user){
            res.status(201).json({_id: user.id, email: user.email});
        }else {
            res.status(400).json({
                message: "User data is not valid."
            });
            //throw new Error("User data is not valid.")
        }
    },
    loginAdmin: async (req:Request, res: Response) => {
        const { email, password } = req.body
        if(!email || !password){
            res.status(400).json({
                message: "All fields are mandatory"
            })
            //throw new Error()
            return
        }
        const user = await AdminService.getByEmail(email) //adminModel.findOne({email})
        // compare password with hashed password
        if(user && (await bcrypt.compare(password, user.password))){
            // if this is try we need to provide an access token in the response
            const payload = {
                user:{
                    email: user.email,
                    id: user.id
                }
            }
            if(process.env.ACCESS_TOKEN_SECRET){
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, 
                    { expiresIn: "15m" } // 1minute
                )
                res.status(200).json({accessToken})
            }
        }else{
            res.status(401).json({
                message: "Email or Password is not valid"
            })
        }
    },
    reset: async (req: Request, res: Response) => {
        const params = req.query
        if(params.busNumber && params.reset){
            const busReset = await resetBus(<String>req.query.busNumber)
            if(busReset){
                res.status(200).json({
                    message: `Bus with id ${busReset._id} reseted`,
                    busDetails: busReset
                })
                return
            }
        }
        else if(params.reset && Object.keys(params).length === 1){
            const sysReset = await resetPlatform()
            res.status(200).json(sysReset)
        }
        else{
            res.status(400).send(`Invalid Request`)
        }
    }
}
