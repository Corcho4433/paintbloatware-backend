import { db } from "../db/db";
import { Router } from "express";
import path from "node:path";
import MinioClientSingleton from "../minio/minio-client";
import { BUCKET_NAME_PFP } from "../minio/minio-setup";

const minioClient = MinioClientSingleton.getInstance();
const bucketName = BUCKET_NAME_PFP;

export const uploadToMinio = async (file: Express.Multer.File, userId: string) => {
  try {
    // Genera un nombre único para el archivo
    const fileName = `${userId}-${Date.now()}${path.extname(file.originalname)}`;

    // Subir el archivo a MinIO
    await minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      { "Content-Type": file.mimetype }
    );

    // Retornar la URL pública del archivo
    const fileUrl = `/minio/${bucketName}/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error al subir la imagen a MinIO:", error);
    return null;
  }
};

export const setPfp = async (id_user: string, pfp_url: string) => {
	try {
		return await db.user.update({
			where: { id: id_user },
			data: { urlPfp: pfp_url },
		});

	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getPfpByUser = async (id_user: string) => {
	try {
		return await db.user.findUnique({
			where: { id: id_user },
			select: {
				urlPfp: true,
			},
		});
	} catch (error) {
		console.error(error);
		return null;
	}
};