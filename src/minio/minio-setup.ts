import MinioClientSingleton from "./minio-client";

const minio = MinioClientSingleton.getInstance();

const BUCKET_NAME_IMAGES = "images";
const BUCKET_NAME_PFP = "pfps";

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
      "Resource": ["arn:aws:s3:::${BUCKET_NAME_IMAGES}/*"]
    }
  ]
}
`;

export async function setupMinioBucket() {
	try {
		const exists = await minio.bucketExists(BUCKET_NAME_IMAGES);
		const existsPfp = await minio.bucketExists(BUCKET_NAME_PFP);
		if (!exists) {
			console.log(`Bucket "${BUCKET_NAME_IMAGES}" no existe. Creando...`);
			await minio.makeBucket(BUCKET_NAME_IMAGES, "us-east-1");
		} else {
			console.log(`Bucket "${BUCKET_NAME_IMAGES}" ya existe.`);
		}

		if (!existsPfp) {
			console.log(`Bucket "${BUCKET_NAME_PFP}" no existe. Creando...`);
			await minio.makeBucket(BUCKET_NAME_PFP, "us-east-1");
		} else {
			console.log(`Bucket "${BUCKET_NAME_PFP}" ya existe.`);
		}

		await minio.setBucketPolicy(BUCKET_NAME_IMAGES, bucketPolicy);
		await minio.setBucketPolicy(BUCKET_NAME_PFP, bucketPolicy);

		console.log(
			`✅ Bucket "${BUCKET_NAME_IMAGES}" con política pública de solo lectura aplicado.`,
		);
		console.log(
			`✅ Bucket "${BUCKET_NAME_PFP}" con política pública de solo lectura aplicado.`,
		);

	} catch (error) {
		console.error("Error al configurar el bucket de MinIO:", error);
		throw error;
	}
}

export { BUCKET_NAME_IMAGES };
export { BUCKET_NAME_PFP };