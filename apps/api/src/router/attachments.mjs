import express from "express";
import { success } from "../helper.mjs";
import { Attachment } from "../db/sequelize.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import { createAttachment, getAttachment } from "../services/attachments.mjs";
import { archiveAttachment, deleteAttachment, editAttachment } from "../controllers/attachments.mjs";

const attachmentsRouter = express();

//Get a specific attachment
attachmentsRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), getAttachment); //Check if used - TODO

//Create an attachment
attachmentsRouter.post("/", auth, authorizeRoles("admin", "teacher"), createAttachment);

//Archive an attachment
attachmentsRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveAttachment);

//Delete an attachment
attachmentsRouter.delete("/:id", auth, authorizeRoles("admin", "teacher"), deleteAttachment);

//Edit an attachment
attachmentsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editAttachment);

export { attachmentsRouter };