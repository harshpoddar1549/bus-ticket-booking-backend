import { Request, Response } from "express"
import busModel from "../models/bus.model"
import { BusService } from "../services/bus.service"
export const BusController = {

    createBus: async (req: Request, res: Response) => {
        let bus = await busModel.findOne({
            busNumber : req.body.busNumber,
            //routeNumber : req.body.routeNumber
        })
        if(!bus){
            try{
                bus = await busModel.create(req.body)
                res.status(200).json({
                    message: `Bus Created`,
                    busDetails: bus
                })
            }catch(err){
                console.log(err)
                res.status(400).json(err)
            }
        }else{
            res.status(400).json({
                message: `Bus already exists.`,
                busDetails: bus
            })
        }
    },
    fetchBus:async (req:Request, res: Response) => {
        if(req.query.busNumber){
            try{
                const bus = await BusService.fetchBus(<String>req.query.busNumber)
                res.status(200).json(bus) 
            }catch(err){
                console.log(err)
                res.status(400).json(err)
            } 
        }else{
            try{
                const allBuses = await BusService.fetchAllBuses()
                res.status(200).json(allBuses)
            }catch(err){
                console.log(err)
                res.status(400).json(err)
            }
        }
        
    },

    fetchAllBus : async (req: Request, res: Response) => {
        try{
            const allBuses = await BusService.fetchAllBuses()
            res.status(200).json(allBuses)
        }catch(err){
            console.log(err)
            res.status(400).json(err)
        }    
    }
}