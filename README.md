# itsec-password

This application is used by Blekinge Institute of Technology in the course DV1616, Information security with web applications.

More information about this course can be found at the course site, located [here](https://dbwebb.se/kurser/itsec) and more information about the task in which this application is used can be found [here](https://dbwebb.se/kurser/itsec/kmom04).

## Usage

You can run this application using the following command, as long you have `node > 12.0` installed.

```bash
# Install the necessary dependencies
npm install
# To run the application using nodemon
npm run dev
# To run the application using node
npm start
```

### Docker

The repository also contains the necessary files to run the application with Docker. Simply run the following command:

```bash
docker-compose up -d
```

And you can access the application by navigating to http://localhost:3000/

You can watch the logs by running

```bash
docker logs <CONTAINER_ID> -f
```
