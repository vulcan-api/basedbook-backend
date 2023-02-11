# This file is uncomplited
# TODO: setup correctly docker

FROM node:18
RUN npm i -g pnpm
RUN pnpm add -g prisma warp

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm build

COPY . .


ENV DATABASE_URL="postgresql://elektryk:%26DZWspN5r2~fLoc@193.46.243.109:5432/muj_elektryk"
# TODO: set SMTP_* env
ENV SMTP_HOST=""
ENV SMTP_USER=""
ENV SMTP_PASS=""
ENV SMTP_PORT=""
ENV SECRET="secret"

EXPOSE 3000

CMD [ "pnpm", "start:prod" ]
