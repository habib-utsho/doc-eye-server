import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/appError";

const jwtVerify = async (token: string, tokenSecret: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, tokenSecret) as JwtPayload;
  } catch (e) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  }

  return decoded;
};

export default jwtVerify;
