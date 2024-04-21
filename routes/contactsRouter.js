import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStstusContactSchema,
} from "../schemas/contactsSchemas.js";
import { isValidId } from "../midelwares/isValidId.js";
import { protect } from "../midelwares/authMiddlewares.js";

const contactsRouter = express.Router();
contactsRouter.use(protect);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateStstusContactSchema),
  updateStatusContact
);

export default contactsRouter;
