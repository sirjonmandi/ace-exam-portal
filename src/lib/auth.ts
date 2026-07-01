export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StoredUser extends User {
  password: string;
}

const SESSION_KEY = "ace_session";
const USERS_KEY = "ace_users";

// Seeded demo accounts
const SEED_USERS: StoredUser[] = [
  {
    id: "user-1",
    name: "Pawan Rayalu",
    email: "pawan@example.com",
    password: "password123",
    role: "CFA Candidate",
  },
  {
    id: "user-2",
    name: "Prasenjit Dutta",
    email: "prasenjitdutta198@gmail.com",
    password: "password123",
    role: "CFA Candidate",
  },
];

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {}
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function setToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function clearStoredUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("authToken");
}

export function loginUser(
  email: string,
  password: string,
): User | null {
  const users = loadUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password,
  );
  if (!match) return null;
  const { password: _pw, ...user } = match;
  persistUser(user);
  return user;
}

export function setUserInfo(user: User, token: string) {
  persistUser(user);
  setToken(token);
  return user;
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): { user: User } | { error: string } {
  const trimmedEmail = email.toLowerCase().trim();
  const users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { error: "An account with this email already exists." };
  }
  const user: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    role: "CFA Candidate",
  };
  saveUsers([...users, { ...user, password }]);
  persistUser(user);
  return { user };
}

export function logoutUser() {
  clearStoredUser();
}
