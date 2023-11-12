import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct,
} from '../controllers/product.controller'
import { createProductSchema, updateProductSchema } from '../schemas/product.schema'
import {validate} from "../schemas/validate";

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.post('/', validate(createProductSchema), createProduct)
router.put('/:id', validate(updateProductSchema), updateProduct)
router.delete('/:id', deleteProduct)

export default router
