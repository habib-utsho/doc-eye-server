import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { talkToDbService } from './talkToDb.service'

const talkToDb = catchAsync(async (req, res) => {
    const { collection, data, total, summary } = await talkToDbService.talkToDb(
        req.query
    )


    const page = req.query?.page ? Number(req.query.page) : 1
    const limit = req.query?.limit ? Number(req.query.limit) : 10
    const totalPage = Math.ceil(total / limit)

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: summary,
        collection,
        data,
        meta: { total, page, totalPage, limit },
    })
})

export const talkToDbController = {
    talkToDb,
}
