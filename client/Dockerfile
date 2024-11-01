FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/dist ./dist 

EXPOSE 3000

CMD ["bun", "run", "dev"]


# run this for bulding the container    [ docker build -t expense_tracker_client . ]

# and after run this [ docker run -p 3000:80 expense_tracker_client ]
