import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { store } from './store.js';
import { parseId, validateEmployee } from './validate.js';

const app = express();
const PORT = process.env.PORT || 3001;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

app.use(express.json());
app.use(express.static(path.join(rootDir, 'public')));

function getCleanFields(body) {
  const data = {};
  for (const key of ['name', 'email', 'role', 'department']) {
    if (body[key] !== undefined) data[key] = body[key].trim();
  }
  return data;
}

app.get('/api/employees', (req, res) => res.json(store.findAll(req.query)));

app.get('/api/employees/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid employee ID' });
  const emp = store.findById(id);
  emp ? res.json(emp) : res.status(404).json({ error: 'Employee not found' });
});

app.post('/api/employees', (req, res) => {
  const err = validateEmployee(req.body, false);
  if (err) return res.status(400).json({ error: err });
  res.status(201).json(store.create(getCleanFields(req.body)));
});

app.patch('/api/employees/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid employee ID' });
  const err = validateEmployee(req.body, true);
  if (err) return res.status(400).json({ error: err });
  const updated = store.update(id, getCleanFields(req.body));
  updated ? res.json(updated) : res.status(404).json({ error: 'Employee not found' });
});

app.delete('/api/employees/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid employee ID' });
  store.remove(id) ? res.json({ message: 'Employee deleted' }) : res.status(404).json({ error: 'Employee not found' });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.listen(PORT, () => console.log(`Day 4 Server running on http://localhost:${PORT}`));