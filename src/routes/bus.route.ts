import { Router } from "express";
import { BusController } from "../controllers/bus.controller";

const busRouter = Router()

// either gets all or if body with busId provided, fetchs the details for the bus
busRouter.get('/', BusController.fetchBus)


// create a bus service
busRouter.post('/', BusController.createBus)

export default busRouter