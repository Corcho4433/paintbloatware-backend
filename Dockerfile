# paintbloatware-backend/Dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copiar package.json y lockfile
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build de la aplicación
RUN bun run build

# Exponer puerto
EXPOSE 60014

# Comando para iniciar la aplicación
CMD ["bun", "run", "start"]