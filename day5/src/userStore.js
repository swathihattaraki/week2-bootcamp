const users = [];
let nextId = 1;

export const userStore = {
  findByEmail(email) {
    return users.find(u => u.email === email.toLowerCase()) || null;
  },

  create({ name, email, passwordHash, role = 'user' }) {
    const cleanEmail = email.toLowerCase();
    if (this.findByEmail(cleanEmail)) return null; // Enforce unique email

    const user = {
      id: nextId++,
      name,
      email: cleanEmail,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user'
    };
    users.push(user);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
};