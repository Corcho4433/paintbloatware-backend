import express from "express";
import { setPfp, getPfpByUser, uploadToMinio } from "../services/pfp-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { BadRequest, NotFound } from "../errors/server_errors";
import multer from "multer";

export const pfpRouter = express.Router();

// Configurar Multer para almacenar el archivo temporalmente en el servidor
const storage = multer.memoryStorage(); // Usamos memoria para evitar escribir en disco

// Función para filtrar solo imágenes
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];  // Tipos MIME permitidos
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);  // Permite el archivo
  } else {
    cb(null, false);  // Rechaza el archivo, pero no pasa un error directamente a Multer
    // Si necesitas lanzar un error, puedes hacerlo después en el flujo de ejecución.
  }
};

const upload = multer({ 
  storage,
  fileFilter 
});

const uploadSingle = upload.single("pfp"); // 'pfp' es el nombre del campo del archivo en el body de la solicitud


pfpRouter.post("/", isAuthMiddleware, uploadSingle, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const pfp = req.file;

    // Verificar si el archivo fue rechazado (Multer lo establece en `null` si fue rechazado)
    if (!pfp) {
      throw new BadRequest("Solo se permiten imágenes (JPG, PNG, GIF y BMP)");
    }

    if (!user) {
      res.status(401);
      return;
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
    console.log("further error");
    next(error);
  }
});

pfpRouter.put("/", isAuthMiddleware, uploadSingle, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const newPfp = req.file;

        // Verificar si el archivo fue rechazado (Multer lo establece en `null` si fue rechazado)
    if (!newPfp) {
      throw new BadRequest("Solo se permiten imágenes (JPG, PNG, GIF y BMP)");
    }

    // Subir nueva foto
    const newPfpUrl = await uploadToMinio(newPfp, user.id);

    if (!newPfpUrl) {
      throw new NotFound("No se pudo subir la nueva foto de perfil");
    }

    // Actualizar en base de datos
    const updatedPfp = await setPfp(user.id, newPfpUrl);

    if (!updatedPfp) {
      throw new NotFound("No se pudo actualizar la foto de perfil");
    }

    res.status(200).json({
      message: "Foto de perfil actualizada exitosamente",
      pfp: updatedPfp
    });
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