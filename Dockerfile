FROM oven/bun
COPY . .
RUN bun install
CMD ["bun", "src/backend/backend.ts"]
EXPOSE 3000