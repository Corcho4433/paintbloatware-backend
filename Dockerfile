FROM oven/bun:1-alpine
WORKDIR /app

# Instalar OpenSSL y timezone data
RUN apk add --no-cache openssl tzdata

# Configurar zona horaria
ENV TZ=UTC

# Copiar package.json y lockfile
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Generar Prisma Client (usando npx porque Prisma tiene mejor soporte con Node)
RUN bunx prisma generate

# Build de la aplicación
RUN bun run build

# Exponer puerto
EXPOSE 60014

# Ejecutar con node en lugar de bun para mejor compatibilidad con Prisma
CMD ["bun", "run", "./dist/index.js"]