# Paintbloatware Backend

API REST para la plataforma Paintbloatware. Desarrollada con **Bun**, **Express**, **Prisma** y **PostgreSQL**.

## Funcionalidad principal

- **Autenticación**: OAuth (Google, GitHub), JWT con access/refresh tokens.
- **Publicaciones**: CRUD de posts, filtrado por tags, posteos con imágenes.
- **Comentarios**: Comentarios y threads con paginación, likes.
- **Tags**: Creación y gestión de etiquetas para clasificar contenido.
- **Tendencias**: Contenido trending por popularidad (likes en 12h/24h) y por tag.
- **Perfiles**: Foto de perfil (subida a MinIO/S3).
- **Valoraciones**: Ratings asociados a posts/servicios.
- **Suscripciones y pagos**: Integración con Mercado Pago (suscripciones y webhooks).
- **Admin**: Endpoints protegidos para moderación (usuarios, posts, comentarios, tags).
- **IA**: Integración con Gemini para funcionalidades asistidas.

## Requisitos previos

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) y Docker Compose

## Configuración del entorno

1. Clonar el repositorio e instalar dependencias:

```bash
bun install
```

2. Crear un archivo `.env` en la raíz del proyecto a partir de la plantilla:

```bash
cp .env.template .env
```

3. Completar las variables en `.env` (credenciales de base de datos, MinIO, OAuth, Mercado Pago, Gemini, etc.). Ver `.env.template` para la lista de variables.

## Base de datos y servicios externos

La aplicación utiliza **PostgreSQL** y **MinIO** (almacenamiento de objetos). Ambos se ejecutan con Docker Compose.

### Levantar PostgreSQL y MinIO

1. Asegurarse de que Docker esté instalado y el servicio en ejecución.

2. Iniciar los contenedores en segundo plano:

```bash
docker-compose up -d
```

Esto levanta:

- **PostgreSQL** en `localhost:5432` (usuario, contraseña y base definidos en `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- **MinIO** en `localhost:9000` (API) y `localhost:9001` (consola web), con credenciales en `MINIO_ROOT_USER` y `MINIO_ROOT_PASSWORD`.

3. Aplicar migraciones y generar el cliente Prisma:

```bash
bun run migrate
bun run generate
```

4. (Opcional) Para generar un usuario administrador inicial:

```bash
bun run admingenerate
```

## Ejecutar la aplicación

Modo desarrollo (con recarga en caliente):

```bash
bun run dev
```

El servidor queda disponible en `http://localhost:3000` (o en el `PORT` definido en `.env`).

### Otros comandos útiles

| Comando | Descripción |
|--------|-------------|
| `bun run build` | Compila para producción. |
| `bun run start` | Ejecuta la versión compilada. |
| `bun run resetdb` | Reinicia la base de datos (cuidado en entornos con datos). |
| `bun run payments` | Tarea de verificación de pagos. |
| `bun run deletesubscriptions` | Tarea de eliminación de suscripciones. |

## Health check

```http
GET /health
```

Responde con el estado del servicio (`{ "status": "healthy" }`).
