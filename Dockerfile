FROM oven/bun:latest

# Instalar tzdata para que Node/Bun pueda usar zonas horarias
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

# Establecer la zona horaria
ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /app

# Copiar package.json y lockfile
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN bun generate

# Build de la aplicación (compila TS a JS en ./dist)
RUN bun run build

# Exponer puerto
EXPOSE 60014

# Ejecutar el código compilado
CMD ["bun", "run", "./dist/index.js"]
