import { db } from "./db";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function makeAdmin() {
  const users = await db.user.findMany({
    select: { id: true, name: true },
  });

  console.log("\n=== Lista de Usuarios ===");
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (ID: ${user.id})`);
  });

  rl.question("\nIngresa el número del usuario que quieres hacer admin: ", async (input) => {
    const position = parseInt(input) - 1;
    
    if (position < 0 || position >= users.length) {
      console.error("❌ Número inválido");
      rl.close();
      process.exit(1);
    }

    const selectedUser = users[position];
    
    try {
      await db.admin.create({
        data: {
          userId: selectedUser!.id,
        },
      });
      
      console.log(`✓ Usuario ${selectedUser!.name} ahora es admin`);
    } catch (error) {
      console.error("Error al crear admin:", error);
    }
    
    rl.close();
    process.exit(0);
  });
}

makeAdmin();