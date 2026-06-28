export const SUGGESTED_QUESTIONS = [
  'What projects have you built?',
  'Tell me about DevTunnel',
  'What tech stack do you use?',
  'How can I use your open source projects?',
  'What are you learning right now?',
  'Are you available for work?',
  'What is his most technically complex project?',
];

const GREETINGS = [
  "Hey! 👋 How's your day going?",
  "Hey there! Hope you're having a good one 😊",
  "Hi! Great to see you here. What's up?",
  "Hey! How's it going? Feel free to ask me anything.",
  "Heyyy! 👋 Hope your day's treating you well!",
];

export const WELCOME_MESSAGE = () =>
  GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
