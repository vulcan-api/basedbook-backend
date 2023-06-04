FROM postgres

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

RUN apt update
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

RUN npm i -g prisma yarn

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY ./prisma ./prisma

USER postgres

RUN initdb -D /var/lib/postgresql/data
RUN pg_ctl -D /var/lib/postgresql/data start && \
    createdb basedbook && \
    export export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/basedbook && \
    prisma migrate deploy && \
    pnpm db:seed

EXPOSE 5432
CMD ["postgres"]

