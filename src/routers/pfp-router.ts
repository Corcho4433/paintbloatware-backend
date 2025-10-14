import express from "express";
import { setPfp, getPfpByUser, uploadToMinio } from "../services/pfp-service";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { BadRequest, NotFound } from "../errors/server_errors";
import multer from "multer";

export const pfpRouter = express.Router();

// Configurar Multer para almacenar el archivo temporalmente en el servidor
const storage = multer.memoryStorage(); // Usamos memoria para evitar escribir en disco
const upload = multer({ storage });

const uploadSingle = upload.single("pfp"); // 'pfp' es el nombre del campo del archivo en el body de la solicitud

pfpRouter.post("/", isAuthMiddleware, uploadSingle,  async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const pfp = req.file;

    if (!pfp) {
      throw new BadRequest("Debes enviar una foto de perfil");
    }
    if (!user) {
      res.status(401)
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
    next(error);
  }
});
pfpRouter.put("/", isAuthMiddleware, uploadSingle, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const newPfp = req.file;
    if (!newPfp) {
      res.json("Error uploading profile picture").status(400)
      throw new BadRequest("Debes enviar una nueva foto de perfil");
    }


    
    // Subir nueva foto
    const newPfpUrl = await uploadToMinio(newPfp, user.id);

    if (!newPfpUrl) {

      res.json("Error uploading profile picture").status(400)
      throw new NotFound("No se pudo subir la nueva foto de perfil");
    }

    // Actualizar en base de datos
    const updatedPfp = await setPfp(user.id, newPfpUrl);

    if (!updatedPfp) {
      res.json("Error updating profile picture").status(400)
      throw new NotFound("No se pudo actualizar la foto de perfil");

    }

    // Opcional: Eliminar archivo anterior de MinIO aquí
    // await deleteFromMinio(oldPfp.url);

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