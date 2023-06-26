const contactsRouter = require('express').Router();
const User = require('../models/user');
const Contact = require('../models/contact');

contactsRouter.get('/', async (request, response) => {
    const user = request.user;
    const contacts = await Contact.find({ user: user.id });
    return response.status(200).json(contacts);
 });

 contactsRouter.post('/', async (request, response) => {
    const user = request.user;
    const { name, direction, number } = request.body;
    const newContact = new Contact({ 
     name,
     direction,
     number,
     user: user._id
    });
    const savedContact = await newContact.save();
    return response.status(201).json(savedContact);
 });

 contactsRouter.post('/', async (request, response) => {
    const user = request.user;
    const { name, direction, number } = request.body;
  
    try {
      const newContact = new Contact({ 
        name,
        direction,
        number,
        user: user._id
      });
  
      const savedContact = await newContact.save();
  
      // Actualizar el recuento de contactos en el usuario
      await User.findByIdAndUpdate(user._id, { $inc: { contactCount: 1 } });
  
      return response.status(201).json(savedContact);
    } catch (error) {
      return response.status(500).json({ error: 'Error al crear el contacto' });
    }
  });

  contactsRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    const contactId = request.params.id;
  
    try {
      // Verificar si el contacto pertenece al usuario
      const contact = await Contact.findOne({ _id: contactId, user: user._id });
      if (!contact) {
        return response.status(404).json({ error: 'Contacto no encontrado' });
      }
  
      await Contact.findByIdAndRemove(contactId); // Eliminar el contacto de la base de datos
  
      // Eliminar el contacto de la lista de contactos del usuario
      user.agenda = user.agenda.filter((contact) => contact.toString() !== contactId);
      await user.save();
  
      return response.sendStatus(204); // Devolver una respuesta exitosa sin contenido
    } catch (error) {
      return response.status(500).json({ error: 'Error al eliminar el contacto' });
    }
  });
  
 
  contactsRouter.put('/:id', async (request, response) => {
    const user = request.user;
    const contactId = request.params.id;
    const { name, direction, number } = request.body;
  
    try {
      // Verificar si el contacto pertenece al usuario
      const contact = await Contact.findOne({ _id: contactId, user: user._id });
      if (!contact) {
        return response.status(404).json({ error: 'Contacto no encontrado' });
      }
  
      contact.name = name;
      contact.direction = direction;
      contact.number = number;
  
      const updatedContact = await contact.save();
  
      return response.status(200).json(updatedContact);
    } catch (error) {
      return response.status(500).json({ error: 'Error al editar el contacto' });
    }
  });
  
  
  
  
  
  
  


module.exports = contactsRouter;
