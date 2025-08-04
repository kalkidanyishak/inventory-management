import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LogInType, SignUpType } from '@/types/user.types';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in .env file');
}

export const signup = async (userData: SignUpType) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
  const newUser = await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });

  // Create a JWT for the new user
  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  const { password, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

export const login = async (credentials: LogInType) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};