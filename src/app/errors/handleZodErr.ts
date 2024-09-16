import { StatusCodes } from "http-status-codes"
import { TErrorSources, TGenericErrorResponse } from "../interface/error"
import { ZodError, ZodIssue } from "zod"

const handleZodErr = (err:ZodError):TGenericErrorResponse => {   
    const statusCode = StatusCodes.BAD_REQUEST
    const message = "Validation error!"
    const errorSources:TErrorSources = err?.issues?.map((issue:ZodIssue)=> {
        return {
            path: issue.path?.[issue?.path?.length-1],
            message: issue?.message
        }
    })
    return {
        statusCode,
        message,
        errorSources
    }
 }

 export default handleZodErr