import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const data = await listContacts();
  const [contact] = data.filter((contact) => contact.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const data = await listContacts();
  const contactIndex = data.findIndex((contact) => contact.id === contactId);
  if (contactIndex === -1) {
    return null;
  }
  const [deleteContact] = data.splice(contactIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return deleteContact;
}

export async function addContact(body) {
  const data = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };

  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return newContact;
}

export async function updateContact(contactId, body) {
  const data = await listContacts();
  const contactIndex = data.findIndex((contact) => contact.id === contactId);
  if (contactIndex === -1) {
    return null;
  }
  data[contactIndex] = { ...data[contactIndex], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return data[contactIndex];
}
