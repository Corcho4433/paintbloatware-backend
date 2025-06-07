import type { User } from "../models/User";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SECRET_KEY: string;
			SECRET_KEY_REFRESH: string;
		}
	}
	namespace Express {
		interface Request {
			context?: {
				user: User;
			};
		}
	}
}
