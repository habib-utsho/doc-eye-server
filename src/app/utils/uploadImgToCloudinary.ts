import { v2 as cloudinary } from 'cloudinary'
import AppError from '../errors/appError'
import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import fs from 'fs'

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
})

export const uploadImgToCloudinary = async (
  fileName: string,
  filePath: string,
) => {
  const res = await cloudinary.uploader
    .upload(filePath, {
      public_id: fileName,
    })
    .catch((error) => {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `${error || 'Error uploading image to cloudinary'}`,
      )
      //   console.log(error)
    })

  // Remove the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`)
      return
    }

    console.log(`File ${filePath} has been successfully removed.`)
  })

  return res
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

export const upload = multer({ storage: storage })
