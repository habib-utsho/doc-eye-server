import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { paymentServices } from './payment.service'

const initPayment = catchAsync(async (req, res) => {
  const data = await paymentServices.initPayment(req.body)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Redirected to the payment page!',
    data: data,
  })
})




const failedPayment = catchAsync(async (req, res) => {

  const queryParams: Record<string, any> = req.query;
  Object.keys(queryParams).forEach(key => {
    if (!queryParams[key]) {
      delete queryParams[key];
    }
  });
  const queryString = new URLSearchParams(queryParams).toString();;
  return res.redirect(`${process.env.CLIENT_URL}/doctor/${req.query?.doctorCode}/checkout/failed?${queryString}`);
})


export const paymentControllers = {
  initPayment,
  failedPayment
}
