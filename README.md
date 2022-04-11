=================================\n
===  TO RUN THIS APPLICATION  ==\n
===    IN LOCAL ENVIRONMENT   ===\n
=================================\n

1. Create .env file and set your credentials.

2. RUN `docker-compose up -d` to create postgres database in your local Docker environment.

3. RUN `yarn` to download all project dependencies.

4. RUN `tsc --emitDecoratorMetadata true --experimentalDecorators true --outDir migrations migrations/*.ts` to create JS    files from TS migration files.

5. RUN `typeorm migration:run --connection default` to create database and tables


6. RUN `yarn start` to start-up the project


You can use below url to get swagger documentation of the project
-- http://localhost:2805/api
