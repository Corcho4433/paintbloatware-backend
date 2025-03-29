/* import express from 'express';
import userRoutes from './routes/userRoutes';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Clean up on exit
process.on('SIGTERM', () => {
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  pool.end();
  process.exit(0);
}); */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
import { db } from './db';

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();
