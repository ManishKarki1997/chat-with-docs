import AWS from 'aws-sdk'

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      credentials: new AWS.Credentials({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
      }),

    })

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
      },
      region: process.env.NEXT_PUBLIC_AWS_REGION
    })

    const fileKey = "uploads/" + Date.now().toString() + file.name.replace(" ", '-')

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: fileKey,
      Body: file,
    }
    console.log("params", params, {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
    })
    const upload = s3.putObject(params)
      .on("httpUploadProgress", progress => {
        console.log("Upload progress ", progress)
      }).promise()

    await upload

    return Promise.resolve({
      fileKey,
      fileName: file.name
    })
  } catch (error) {
    throw error
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`
  return url
}