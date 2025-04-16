FROM oven/bun
COPY . .
RUN bun install
CMD ["bun", "src/backend.ts"]
EXPOSE 3005