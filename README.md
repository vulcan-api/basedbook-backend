# BasedBook backend
![](https://img.shields.io/github/actions/workflow/status/nasz-elektryk/basedbook-backend/tests.yml?logo=github-actions&logoColor=white&style=for-the-badge)
![](https://img.shields.io/github/license/nasz-elektryk/basedbook-backend?logo=gnu&style=for-the-badge)
![](https://img.shields.io/github/package-json/v/nasz-elektryk/basedbook-backend?color=yellow&logo=pnpm&logoColor=white&style=for-the-badge)

An innovative educational social platform backend.

Have you ever thought of a social platform, which combines your school's online grade book, friends and communities? If you have, the answer for you is **BasedBook**.

# Why BasedBook?
## Modular design
Our social platform is designed to be modular. Backend API is separated from frontend, which means if you don't like our UI, you can always write your own frontend in your favourite framework.

## Modern and easy to understand technologies
BasedBook is written in modern NestJS framework and TypeScript, which insures type safety. Code is clean and easy to understand, to make developers' lives easier.

## BasedBook ties your local communities together
BasedBook lets you share your ideas and projects with other people in your school, village, town or city.

# How to build and run
## Requirements
- NodeJS (required v16.0.0+, but we recommend using the latest LTS version)
- pnpm (install by running ```npm i -g pnpm```)
- PostgresSQL
- other things specified in .env.example file
## Steps
#### 1. Clone the repository
``` git clone [repo_url]```
#### 2. Enter the directory
``` cd basedbook-backend ```
#### 3. Install dependencies and build prisma
``` pnpm build ```
#### 4. Create .env file and change values to your own
``` cp .env.example .env ```
#### 5. Build for production
``` pnpm build:prod ```
#### 6. Run
``` pnpm start ```


# Some commands:
### Running in the watch mode
``` pnpm start:dev ``` OR ``` nodemon ```

### Running from compiled js files
``` pnpm start ```

### Build project (node_modules + prisma)
``` pnpm build ```

### Build prisma
``` pnpm build:prisma ```

### Build (node_modules + prisma + TS into JS)
``` pnpm build:prod ```

### We highly recommend to use prepared commands. You can add or/and check other commands in package.json file
