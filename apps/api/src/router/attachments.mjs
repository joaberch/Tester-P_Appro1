import express from "express";
import authorizeRoles from "../middlewares/role.mjs";
import auth from "../middlewares/auth.mjs";
import { archiveAttachment, deleteAttachment, editAttachment, createAttachment, getAttachment } from "../controllers/attachments.mjs";
import multer from "multer";

const upload = multer();

const attachmentsRouter = express.Router();

//Get a specific attachment
attachmentsRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), getAttachment); //Check if used - TODO

//Create an attachment
attachmentsRouter.post("/", auth, authorizeRoles("admin", "teacher"), upload.single("fileContent"), createAttachment);

//Archive an attachment
attachmentsRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveAttachment);

//Delete an attachment
attachmentsRouter.delete("/:id", auth, authorizeRoles("admin", "teacher"), deleteAttachment);

//Edit an attachment
attachmentsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editAttachment);

export { attachmentsRouter };