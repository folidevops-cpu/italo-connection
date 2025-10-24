import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'italoconnection'

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('AWS credentials not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: AWS credentials not set'
    })
  }

  // Get the uploaded file from the request
  const form = await readMultipartFormData(event)
  
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const fileData = form[0]
  const listingType = form.find(item => item.name === 'listingType')?.data.toString()

  if (!fileData.filename || !fileData.type || !listingType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // Validate listing type and determine folder
  let folder: string
  if (listingType === 'room_single' || listingType === 'room_shared') {
    folder = 'house-renting'
  } else if (listingType === 'item') {
    folder = 'items'
  } else if (listingType === 'service') {
    folder = 'service-images'
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid listing type'
    })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const userData = user as any
  const sanitizedFileName = fileData.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `${folder}/${userData.id}/${timestamp}_${sanitizedFileName}`

  try {
    // Upload file directly to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileData.data,
      ContentType: fileData.type
    })

    await s3Client.send(command)

    // Return the public URL (bucket policy makes it public)
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`

    return {
      publicUrl,
      key
    }
  } catch (error: any) {
    console.error('Failed to upload file to S3:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.Code || error.code,
      statusCode: error.$metadata?.httpStatusCode,
      bucket: BUCKET_NAME,
      key: key,
      region: process.env.AWS_REGION
    })
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to upload file: ${error.message || 'Unknown error'}`
    })
  }
})
