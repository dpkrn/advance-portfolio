import ContactMessage from '../../models/ContactMessage.js';

export async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (error) {
    next(error);
  }
}
