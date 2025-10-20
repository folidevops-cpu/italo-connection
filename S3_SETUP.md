# AWS S3 Setup for Image Uploads

This document explains how to configure AWS S3 for storing listing images.

## S3 Bucket Structure

The application uses an S3 bucket with the following folder structure:

```
italoconnection/
├── house-renting/     # Images for room_single and room_shared listings
│   └── {userId}/
│       └── {timestamp}_{filename}
└── items/             # Images for item listings
    └── {userId}/
        └── {timestamp}_{filename}
```

## Upload Method

The application uses **server-side upload** to S3:
- Frontend sends image to your Nuxt API endpoint
- Backend uploads directly to S3 using AWS SDK
- No presigned URLs needed
- No CORS issues since browser only talks to your server

## Setup Instructions

### 1. Create S3 Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. Name it: `italoconnection`
4. Region: Select your preferred region (e.g., `us-east-1`)
5. **Block Public Access settings**: Uncheck "Block all public access"
   - We need public read access for uploaded images
   - Check the acknowledgment box
6. Click "Create bucket"

### 2. Create Folders

1. Open your bucket
2. Click "Create folder"
3. Create two folders:
   - `house-renting/`
   - `items/`

### 3. Configure Bucket Policy

1. Go to bucket → Permissions → Bucket Policy
2. Add this policy (replace `italoconnection` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::italoconnection/*"
    }
  ]
}
```

This allows public read access to all objects in the bucket.

### 4. Configure CORS

1. Go to bucket → Permissions → CORS
2. Add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 5. Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Add users"
3. User name: `italoconnection-uploader`
4. Access type: "Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select: `AmazonS3FullAccess` (or create a custom policy with limited access)
8. Click through to create user
9. **Save the Access Key ID and Secret Access Key** (you won't see the secret again!)

### 6. Environment Variables

Add these to your `.env` file:

```env
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="italoconnection"
```

## Image Upload Limits

- **Maximum 4 images** per listing
- **Supported formats**: JPEG, JPG, PNG, WebP
- **Maximum file size**: 5MB per image
- **Storage locations**:
  - Room listings (`room_single`, `room_shared`) → `house-renting/` folder
  - Item listings (`item`) → `items/` folder

## Security Best Practices

1. **Create a custom IAM policy** instead of using `AmazonS3FullAccess`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::italoconnection/*"
    }
  ]
}
```

2. **Enable bucket versioning** for backup/recovery
3. **Set up lifecycle rules** to archive old images
4. **Monitor costs** with AWS Cost Explorer
5. **Never commit** your AWS credentials to version control

## Testing

After setup, you can test the upload by:

1. Start your dev server: `npm run dev`
2. Go to `/listings/create`
3. Select a listing type
4. Click "Add Photos" and upload an image
5. Check your S3 bucket to verify the image was uploaded to the correct folder

## Troubleshooting

### "Access Denied" errors
- Check your IAM policy permissions
- Verify AWS credentials in `.env`
- Make sure bucket policy allows public read

### CORS errors
- Verify CORS configuration in S3
- Check that `AllowedOrigins` includes your domain

### Images not displaying
- Check that bucket policy allows public read access
- Verify the `publicUrl` format matches your region
- Check browser console for CORS or 403 errors

### "Bucket not found" errors
- Verify `AWS_S3_BUCKET` in `.env` matches your bucket name
- Ensure bucket is in the same region as `AWS_REGION`
