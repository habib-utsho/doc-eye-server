import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

//We can use it or type definition from index.d.ts to modify express request
// Currently we are using index.d.ts

export interface CustomRequest extends Request {
  user?: JwtPayload
}
