import type { UserFromToken } from "./middleware/authMiddleware";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ACCESS_TOKEN_SECRET: string;
			REFRESH_TOKEN_SECRET: string;
		}
	}
	namespace Express {
		interface Request {
			user?: UserFromToken;
		}
	}
}
