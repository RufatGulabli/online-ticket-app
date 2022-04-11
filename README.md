
 ### TO RUN THIS APPLICATION IN LOCAL ENVIRONMENT 

1. Create .env file.
2. Copy all variables declared in `.env.example` file and set your credentials.
3. RUN `docker-compose up -d` to create postgres database in your local Docker instance.
4. RUN `yarn` to download all project dependencies.
5. RUN `tsc --emitDecoratorMetadata true --experimentalDecorators true --outDir migrations migrations/*.ts` to create JS    files from TS migration files.
6. RUN `typeorm migration:run --connection default` to create database and tables.
7. RUN `yarn start` to start-up the project.


You can use below url to get swagger documentation of the project
##### http://localhost:2805/api
