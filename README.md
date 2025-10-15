# paintbloatware-backend

To install dependencies:

```bash
bun install
```

Para levantar la base de datos:

- Instalar docker-compose
- start y enable docker
- sudo docker-compose up -d
- bun run migrate
- bun run generate
- bun run seed
- bun run dev

# TODO List

> Testear endpoints y validar que tengan respuestas
> Likear comentarios
> Likear posts ✅
> Paginacion para los comentarios ✅
> Paginacion para los threads de los comentarios
> Crear tags ✅
> Hacer el fetch de tags ✅
> Trending router ✅
> Tendencias por tags ✅ 
*(agarrar los mas likeados en las ultimas 12h/24h)*
> Filtrar posts por tags ✅ 
> Permitir que usuarios suban imágenes (foto de perfil) a bucket y seteen su foto de perfil ✅ 
> Permitir posteos anónimos
> Validar admin en caso de subir una tag 
> Agregat ratings a los servicios del post ✅ 
> Agregar la fecha de creacion a los comentarios ✅ 

> AGREGAR ENDPOINT PARA BORRAR USUARIOS /api/users/delete/:id



GRACIAS CHIMI