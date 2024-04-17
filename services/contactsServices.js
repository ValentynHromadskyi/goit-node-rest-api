import path from "path";
import { Contact } from "../models/contactsModel.js";
import HttpError from "../helpers/HttpError.js";

const contactsPath = path.join("db", "contacts.json");

export const listContacts = (owner) => Contact.find({ owner });

export const getContactById = async (id, user) => {
  const contact = await Contact.findById(id);
  if (!contact || contact.owner.toString() == !user.id) {
    throw HttpError(404);
  }

  return contact;
};

export const removeContact = (data) => Contact.findOneAndDelete(data);

export const addContact = ({ name, email, phone }, owner) =>
  Contact.create({ name, email, phone, owner: owner._id });

export const updateContact = (data, body) =>
  Contact.findOneAndUpdate(data, body, { new: true });

export const updateStatusContact = (data, body) =>
  Contact.findOneAndUpdate(data, body, { new: true });
