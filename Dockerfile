# paintbloatware-backend/Dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copiar package.json y lockfile
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN bunx prisma generate --no-engine --schema src/db/schema

# Build de la aplicación (compila TS a JS en ./dist)
RUN bun run build

# Exponer puerto
EXPOSE 60014

# Ejecutar el código compilado: bun run ./dist/index.js
CMD ["bun", "run", "./dist/index.js"]