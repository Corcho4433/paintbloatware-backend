import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Crear usuarios
  

  const user2 = await db.user.create({
    data: {
      name: 'Renata Velázquez',
      email: 'renata@example.com',
      password: 'hashedpassword456',
    },
  });
  const user1 = await db.user.create({
    data: {
      name: 'Benicio Verdun',
      email: 'benicio@example.com',
      password: 'hashedpassword123', // En la práctica, esto debería estar hasheado
    },
  });

  // Crear posts
  const post1 = await db.post.create({
    data: {
      content: 'Contenido interesante del post.',
      id_user: user1.id,
      url_bucket: JSON.stringify({ url: 'https://localhost:9000/image1.jpg' }),
    },
  });

const post2 = await db.post.create({
  data: {
      content: 'Pensamientos antes de dormir.',
      id_user: user2.id,
      url_bucket: JSON.stringify({ url: 'https://localhost:9000/image2.jpg' }),
    },
  });


  // Crear comentarios
  await db.comment.create({
    data: {
      content: 'Gran post!',
      id_user: user2.id,
      id_post: post1.id,
    },
  });

  await db.comment.create({
    data: {
      content: 'Gracias por compartir',
      id_user: user1.id,
      id_post: post2.id,
    },
  });

}

main()
  .then(() => {
    console.log('🌱 Seed completo.');
    return db.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return db.$disconnect().then(() => process.exit(1));
  });