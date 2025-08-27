import MinioClientSingleton from './minio-client';

const minio = MinioClientSingleton.getInstance();

const BUCKET_NAME = 'images';


const bucketPolicy = `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::${BUCKET_NAME}/*"]
    }
  ]
}
`;

export async function setupMinioBucket() {
  try {
    const exists = await minio.bucketExists(BUCKET_NAME);
    if (!exists) {
      console.log(`Bucket "${BUCKET_NAME}" no existe. Creando...`);
      await minio.makeBucket(BUCKET_NAME, 'us-east-1');
    } else {
      console.log(`Bucket "${BUCKET_NAME}" ya existe.`);
    }

    // Un pequeño retardo para asegurar que el bucket esté listo
    await new Promise((resolve) => setTimeout(resolve, 300));

    const policyString = JSON.stringify(policyObject);                            

    // Verificamos que el JSON sea válido antes de enviarlo
    if (!bucketPolicy) {
      throw new Error('La política JSON no se pudo stringify. Es inválida.');
    }

    await minio.setBucketPolicy(BUCKET_NAME, bucketPolicy);

    console.log(`✅ Bucket "${BUCKET_NAME}" con política pública de solo lectura aplicado.`);
  } catch (error) {
    console.error('Error al configurar el bucket de MinIO:', error);
    throw error;
  }
}

export { BUCKET_NAME };