# lemac-project

## Project setup

To configure the app please run `npm install` firstly on the root folder, and then in both `\frontend` and `\backend`.
Next, configure the database locally (requires a local mySQL server) by creating the test database and connecting to it in the mySQL shell. Finally, source the `dbschema.sql` into the db using `source .\backend\dbschema.sql`.

To configure the `.env` file in the `\backend` directory, copy the `.env.example` and rename it to `.env` open it and fill in with the local environment variables, including the db connection information, the jwt secret and Fénix API secrets.

## frontend

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```
