// Currently we are using it to modify express request, instead of request.ts

import { JwtPayload } from 'jsonwebtoken'

// For use it , I have to define types in tsconfig.json
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
