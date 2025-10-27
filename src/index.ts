import express from "express";
import { authRouter } from "./routers/auth-router";
import { commentRouter } from "./routers/comment-router";
import { postRouter } from "./routers/post-router";
import { userRouter } from "./routers/user-router";
import { googleRouter } from "./routers/providers/google-router";
import { errorHandler, notFoundHandler } from "./errors/error_middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import MinioClientSingleton from "./minio/minio-client";
import { setupMinioBucket } from "./minio/minio-setup";
import { trendingRouter } from "./routers/trending-router";
import { tagRouter } from "./routers/tag-router";
import { ratingRouter } from "./routers/rating-router";
import { commentThreadRouter } from "./routers/commentThread-router";
import passport from "passport";
import "./services/providers/google-service"; // ✅ Importar para registrar la estrategia de Google
import "./services/providers/github-service"
import { githubRouter } from "./routers/providers/github-router";
import { pfpRouter } from "./routers/pfp-router";
import { geminiRouter } from "./routers/gemini-router";

const app = express();
const PORT = process.env.PORT || 3000;
const minioClient = MinioClientSingleton.getInstance();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser()); // 🍪 Middleware para parsear cookies

// Configuración CORS corregida para manejar cookies
app.use(
	cors({
		origin: "https://paintbloatware.online",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true, // ✅ IMPORTANTE: Permite cookies y credenciales
		optionsSuccessStatus: 200, // Para navegadores legacy
	}),
);

// Routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", googleRouter)
app.use("/api/auth", githubRouter)
app.use("/api/ratings", ratingRouter);
app.use("/api/trends", trendingRouter);
app.use("/api/tags", tagRouter);
app.use("/api/pfp" , pfpRouter)
app.use("/api/comment-threads", commentThreadRouter);
app.use("/api/gemini", geminiRouter);

// Health check
app.get("/health", (req, res) => {
	try {
		res.json({ status: "healthy" });
	} catch (error) {
		console.log(error);
	}
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

async function setupBucket() {
	try {
		await setupMinioBucket();
		console.log("Bucket de MinIO configurado correctamente.");
		// ...inicializar Express, DB, etc.
	} catch (error) {
		console.error("Error crítico durante configuración de MinIO");
		process.exit(1);
	}
}

setupBucket();

async function testConnection() {
	try {
		const buckets = await minioClient.listBuckets();
		console.log("Buckets:", buckets);
		await minioClient.fPutObject(
			"images",
			"test.jpg",
			"/home/corcho/Desktop/bobi.jpg",
		);
		const url = `http://${process.env.MINIO_URL}:${process.env.MINIO_PORT}/images/test.jpg`;
		console.log("URL:", url);
		return url;
	} catch (err) {
		console.error("Error connecting to MinIO:", err);
	}
}

// testConnection();
