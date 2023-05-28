FROM node:18
WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package*.json .
COPY tsconfig*.json .
COPY ./prisma .
RUN pnpm build:prod

COPY . .


ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/basedbook"
# TODO: set SMTP_* env
ENV SECRET="secret"

EXPOSE 3000

CMD [ "pnpm", "start:prod" ]
