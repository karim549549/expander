# Project Overview: NestJS Application

This document provides a summary of the NestJS application in this repository.

## Project Structure

The project follows a standard NestJS layout:

-   `src/`: Contains the application source code.
    -   `main.ts`: The application entry point.
    -   `app.module.ts`: The root application module.
    -   `app.controller.ts`: A basic controller.
    -   `app.service.ts`: A basic service.
    -   `common/`: Likely contains shared modules, services, etc.
    -   `libs/`: Potentially for shared libraries or utility code.
        - `types/`: Contains typescript types.
    -   `users/`: A feature module for managing users, following standard NestJS conventions (controller, service, module, DTOs, entities).
-   `test/`: Contains end-to-end tests.
-   `dist/`: The output directory for compiled code.
-   `node_modules/`: Contains project dependencies.

## Key Files

-   `package.json`: Defines project scripts and dependencies.
    -   **Dependencies**: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`, etc.
    -   **Dev Dependencies**: `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `@types/express`, `@types/jest`, `jest`, `ts-jest`, `ts-loader`, `tsconfig-paths`, `typescript`, etc.
-   `nest-cli.json`: Configuration for the NestJS CLI.
-   `tsconfig.json`: TypeScript compiler configuration.
-   `docker-compose.yml`: Defines services for docker.
-   `Dockerfile`: Used to build the docker image of the app.

## Scripts

-   `npm run build`: Compiles the application.
-   `npm run start`: Starts the application.
--   `npm run start:dev`: Starts the application in watch mode.
-   `npm run test`: Runs unit tests.
-   `npm run test:e2e`: Runs end-to-end tests.

## Modules

-   **AppModule**: The root module of the application.
-   **UsersModule**: A feature module for user-related functionality.

---

# Project Description: Global Expansion Management API

## Description

👋 We are Expanders360, a global expansion partner helping founders and investors enter new markets with ease. Through our network of vetted experts and service providers, we make cross-border growth smooth, compliant, and successful.

We’re now hiring a Backend Developer (3–5 YOE) to build reliable APIs, relational schemas, and hybrid storage systems that support our international expansion platform.

🕓 Start Date: Immediate
🌍 Location: Remote (Egypt-based preferred)
💰 Salary: Paid in USD (or USD-equivalent)

🛠️ How the Hiring Quest Works

    Register for the quest

    Receive full instructions via email after registration closes

    Submit your solution before the deadline

    Top candidates will be invited to a review session

    One candidate will be hired — others may be considered for freelance or future roles

🔍 Who We’re Looking For

    3–5 years of backend development experience

    Strong in NestJS with solid OOP design

    Proficient in MySQL (schema design, joins, transactions, optimization)

    Knowledge of MongoDB for handling unstructured data

    Experienced in building secure REST APIs with RBAC & validation

    Solid understanding of DB migrations, indexing, and caching strategies

    Bonus: experience with message queues, scheduling, or hybrid data architectures

🎯 Your Mission: Build the Global Expansion Management API

Business Context:
Expanders360 helps founders run expansion projects in new countries. Each project requires structured data (clients, vendors, projects) stored in MySQL, and unstructured research documents (e.g., market insights, contracts, reports) stored in MongoDB. Your mission is to design a backend that connects these worlds and powers the matching of projects with vendors.

🛠️ Your Tasks

    Auth & Roles

        Implement JWT authentication in NestJS

        Roles: client, admin

        Clients can manage their own projects

        Admins can manage vendors and system configs

    Projects & Vendors (MySQL) - Relational schema in MySQL:

        clients (id, company_name, contact_email)

        projects (id, client_id, country, services_needed[], budget, status)

        vendors (id, name, countries_supported[], services_offered[], rating, response_sla_hours)

        matches (id, project_id, vendor_id, score, created_at)

    Research Documents (MongoDB)

        Store market reports and project research files in MongoDB (schema-free).

        Each document is linked to a project (projectId).

        Provide an endpoint to:

            Upload a document (title, content, tags).

            Query/search documents by tag, text, or project.

    Project-Vendor Matching

        Build an endpoint /projects/:id/matches/rebuild that generates vendor matches using MySQL queries.

            Matching rules:

                Vendors must cover same country

                At least one service overlap

                Score formula: services_overlap * 2 + rating + SLA_weight

            Store matches in DB with idempotent upsert logic.

    Analytics & Cross-DB Query

        Create an endpoint /analytics/top-vendors that returns:

            Top 3 vendors per country (avg match score last 30 days, from MySQL)

            Count of research documents linked to expansion projects in that country (from MongoDB)

        This requires joining relational and non-relational sources in your service layer.

    Notifications & Scheduling

        When a new match is generated → send email notification (SMTP or mock service).

        Implement a scheduled job (e.g., using NestJS Schedule or BullMQ) that:

            Refreshes matches daily for “active” projects

            Flags vendors with expired SLAs

    Deployment

        Dockerized app with MySQL + MongoDB containers

        Deploy to any free cloud (Render, Railway, AWS free tier, etc.)

        Provide a working .env.example and setup instructions

🧰 Tech Stack

    NestJS (TypeScript)

    MySQL for relational data

    MongoDB for unstructured documents

    JWT Authentication

    ORM: TypeORM (MySQL) + Mongoose (MongoDB)

    Scheduling: NestJS Schedule / BullMQ

    Docker + docker-compose

📝 What You Should Submit

    GitHub repo with:

        Codebase (NestJS modules, services, controllers)

        MySQL migrations + seeds

        MongoDB seed script

        README including: setup, schema diagrams, API list, matching formula, deployment link

    Short demo video: DB schema walkthrough, API demo, analytics query demo

📊 Evaluation Criteria

    API & Architecture (NestJS practices, modularity, DI) – 25%

    MySQL Schema & Queries – 20%

    MongoDB Integration – 15%

    Matching Logic & Analytics – 15%

    Notifications & Scheduling – 10%

    Documentation & DX – 10%

    Deployment – 5%