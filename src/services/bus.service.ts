//import { Request, Response } from "express"
import busModel from "../models/bus.model"

type InputBus = {
    "busNumber": String
    "seats" : String[]
}

export const BusService = {
    fetchAllBuses : async () => {
        try{
            const allBuses = await busModel.find().populate('bookings')
            return allBuses
        }catch(err){
            console.log(err)
            return err
        }  
    },
    fetchBus : async (busNumber:String) => {
        if(busNumber){
            try{
                const queryString = {
                    busNumber: busNumber,
                }
                const bus = await busModel.find(queryString).populate('bookings')
                return bus
            }catch(err){
                console.log(err)
                return err
            } 
        }else{
            try{
                const allBuses = await BusService.fetchAllBuses()
                return allBuses
            }catch(err){
                console.log(err)
                return err
            }
        }
    },
    createBus: async (bus:InputBus) => {
        return await busModel.create(bus)
    }
}