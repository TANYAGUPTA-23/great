import express from 'express'
// import { addProduct } from '../controllers/productController.js'
import authUser from '../middleware/auth.js'
import { getUserCart, addToCart, updateCart } from '../controllers/cartController.js'
import { removeFromCart } from '../controllers/cartController.js' 


const cartRouter = express.Router()

cartRouter.post('/get', authUser, getUserCart)
// cartRouter.post('/add', authUser, addProduct)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)
cartRouter.post('/remove', authUser, removeFromCart)

export default cartRouter;