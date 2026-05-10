import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env";

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
}

export async function uploadRemoteImage(imageUrl: string, folder = "traveloop") {
  if (!env.CLOUDINARY_CLOUD_NAME) {
    return { url: imageUrl, provider: "passthrough" };
  }

  const result = await cloudinary.uploader.upload(imageUrl, { folder });
  return { url: result.secure_url, provider: "cloudinary", publicId: result.public_id };
}
