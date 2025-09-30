import exress from "express";
import { setPfp, getPfpByUser, uploadToMinio } from "../services/pfp-service";
import { isAuthMiddleware } from "../middleware/authMiddleware";
import { BadRequest, NotFound } from "../errors/server_errors";
import multer from "multer";

export const pfpRouter = exress.Router();

// Configurar Multer para almacenar el archivo temporalmente en el servidor
const storage = multer.memoryStorage(); // Usamos memoria para evitar escribir en disco
const upload = multer({ storage });

const uploadSingle = upload.single("pfp"); // 'pfp' es el nombre del campo del archivo en el body de la solicitud

pfpRouter.post("/", isAuthMiddleware, uploadSingle,  async (req, res, next) => {
  try {
    const user = req.user;
    const pfp = req.file;

    if (!pfp) {
      throw new BadRequest("Debes enviar una foto de perfil");
    }

    const pfpUrl = await uploadToMinio(pfp, user.id);

    if (!pfpUrl) {
      throw new NotFound("No se pudo subir la foto de perfil");
    }

    const newPfp = await setPfp(user.id, pfpUrl);

    if (!newPfp) {
      throw new NotFound("No se pudo subir la foto de perfil");
    }

    res.status(200).json({ pfp: newPfp });
  } catch (error) {
    next(error);
  }
});

pfpRouter.get("/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const pfp = await getPfpByUser(id);

		if (!pfp) {
			throw new BadRequest("No se encontró la foto de perfil");
		}

		res.status(200).json({ pfp: pfp });
	} catch (error) {
		next(error);
	}
});