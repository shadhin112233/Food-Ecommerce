import express from "express"
import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js"

import authMiddleware from "../middleware/auth.js"


const cardRouter = express.Router()
cardRouter.post("/add",authMiddleware,addToCart)
cardRouter.post("/remove",authMiddleware,removeFromCart)
cardRouter.post("/get",authMiddleware,getCart)


export default cardRouter