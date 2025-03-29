/* import postgres from 'postgres';
import sql from '../db.ts'; // Import your configured sql instance

interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

export const getUsers = async (): Promise<User[]> => {
  // With postgres.js, you can directly query like this
  const users = await sql<User[]>`SELECT * FROM users`;
  return users;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return user || null;
}; */