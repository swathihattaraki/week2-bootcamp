const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseId(rawId) {
  const id = Number(rawId);
  if (Number.isInteger(id) && id > 0) {
    return id;
  }
  return null;
}

export function validateEmployee(body, isPatch = false) {
  const { name, email, role, department } = body || {};

  if (!isPatch) {
    if (!name?.trim() || !email?.trim() || !role?.trim() || !department?.trim()) {
      return 'Fields name, email, role, and department are required';
    }
  }
  if (email !== undefined && !emailRegex.test(email.trim())) {
    return 'Invalid email format';
  }
  if (name !== undefined && !name.trim()) return 'Name cannot be empty';
  if (role !== undefined && !role.trim()) return 'Role cannot be empty';
  if (department !== undefined && !department.trim()) return 'Department cannot be empty';

  return null;
}