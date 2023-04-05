# This file is uncomplited
# TODO: setup correctly docker

FROM node:18
WORKDIR /app

COPY . .

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm build

#ENV DATABASE_URL="postgresql://elektryk:nie_zgadniesz_hasla@193.46.243.109:5432/muj_elektryk"
# TODO: set SMTP_* env
#ENV SMTP_HOST=""
#ENV SMTP_USER=""
#ENV SMTP_PASS=""
#ENV SMTP_PORT=""
#ENV SECRET="secret"

EXPOSE 3000

CMD [ "pnpm", "start:prod" ]
