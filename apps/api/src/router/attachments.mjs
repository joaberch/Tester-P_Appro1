import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveAttachment, deleteAttachment, editAttachment, createAttachment, getAttachment } from "../controllers/attachments.mjs";
import multer from "multer";

const upload = multer();

const attachmentsRouter = express.Router();

//Get a specific attachment
attachmentsRouter.get("/:id", auth, getAttachment); //Check if used - TODO

//Create an attachment
attachmentsRouter.post("/", auth, upload.single("fileContent"), createAttachment);

//Archive an attachment
attachmentsRouter.put("/archive/:id", auth, archiveAttachment);

//Delete an attachment
attachmentsRouter.delete("/:id", auth, deleteAttachment);

//Edit an attachment
attachmentsRouter.put("/:id", auth, editAttachment);

export { attachmentsRouter };