import { Router } from 'express'
import { reviewController } from './review.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { reviewZodSchema } from './review.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.post('/', auth(USER_ROLE.PATIENT), zodValidateHandler(reviewZodSchema.createReviewZodSchema), reviewController.createReview)
router.get('/', reviewController.getAllReview)
router.get('/:id', reviewController.getReviewById)

export { router as reviewRouter }
