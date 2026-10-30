FROM oven/bun:1
WORKDIR /app

COPY package.json tsconfig.json ./
RUN bun install

COPY . .

EXPOSE 5000

ENV PORT=5000 \
    NODE_ENV=development \
    MONGO_URI=mongodb://mongo:27017/habit_tracker \
    CLIENT_URL=http://localhost:5173

CMD ["bun", "run", "dev"]

