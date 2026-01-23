import bcrypt from 'bcryptjs';

// Simulated user database (in production, use a real database)
let users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    name: 'Demo User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date('2024-01-01'),
  }
];

// Password validation rules
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return errors;
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username must be less than 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return errors;
};

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Find user by username or email
export const findUser = (identifier) => {
  return users.find(user =>
    user.username === identifier || user.email === identifier
  );
};

// Find user by username
export const findUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

// Find user by email
export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Create new user
export const createUser = async (userData) => {
  const { username, email, name, password } = userData;

  // Validate input
  const usernameErrors = validateUsername(username);
  if (usernameErrors.length > 0) {
    throw new Error(usernameErrors.join(', '));
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors.join(', '));
  }

  // Check if user already exists
  if (findUserByUsername(username)) {
    throw new Error('Username already exists');
  }

  if (findUserByEmail(email)) {
    throw new Error('Email already exists');
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    name,
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Authenticate user
export const authenticateUser = async (identifier, password) => {
  const user = findUser(identifier);

  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Generate session token (simplified - in production use JWT)
export const generateSessionToken = (user) => {
  return btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    timestamp: Date.now()
  }));
};

// Verify session token
export const verifySessionToken = (token) => {
  try {
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode JWT payload (middle part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);

    // Validate decoded structure
    if (!decoded.id || !decoded.username) {
      throw new Error('Invalid token structure');
    }

    // Check expiration if present
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }

    // Return at least the basic user info from the token
    // The rest will be synced via credits fetch or other APIs
    return {
      id: decoded.id,
      username: decoded.username,
      name: decoded.username, // Fallback name
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};