let employees = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@company.com', role: 'Engineer', department: 'IT' },
  { id: 2, name: 'Priya Nair', email: 'priya@company.com', role: 'Manager', department: 'HR' },
  { id: 3, name: 'Rohan Verma', email: 'rohan@company.com', role: 'Designer', department: 'Product' }
];
let nextId = 4;

export const store = {
  findAll({ search, department, page = 1, limit = 5 }) {
    let list = employees;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    if (department) {
      list = list.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }

    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Number(limit) || 5);
    const total = list.length;

    return { total, page: p, limit: l, data: list.slice((p - 1) * l, p * l) };
  },

  findById(id) {
    return employees.find(e => e.id === id) || null;
  },

  create(data) {
    const item = { id: nextId++, ...data };
    employees.push(item);
    return item;
  },

  update(id, data) {
    const item = employees.find(e => e.id === id);
    if (!item) return null;
    Object.assign(item, data);
    return item;
  },

  remove(id) {
    const idx = employees.findIndex(e => e.id === id);
    if (idx === -1) return false;
    employees.splice(idx, 1);
    return true;
  }
};