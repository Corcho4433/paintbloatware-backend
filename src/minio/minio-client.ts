import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

if (
  !process.env.MINIO_ROOT_USER ||
  !process.env.MINIO_ROOT_PASSWORD ||
  !process.env.MINIO_URL ||
  !process.env.MINIO_PORT
) {
  throw new Error('Faltan variables de entorno necesarias para MinIO');
}

// TypeScript ya sabe que no pueden ser undefined
const MINIO_ROOT_USER: string = process.env.MINIO_ROOT_USER;
const MINIO_ROOT_PASSWORD: string = process.env.MINIO_ROOT_PASSWORD;
const URL: string = process.env.MINIO_URL;
const PORT: number = Number.parseInt(process.env.MINIO_PORT);

class MinioClientSingleton {
  private static instance: Client;

  private constructor() {}

  public static getInstance(): Client {
    if (!MinioClientSingleton.instance) {
      MinioClientSingleton.instance = new Client({
        endPoint: URL,
        port: PORT,
        useSSL: false,
        accessKey: MINIO_ROOT_USER,
        secretKey: MINIO_ROOT_PASSWORD,
      });
    }
    return MinioClientSingleton.instance;
  }
}

export default MinioClientSingleton;
