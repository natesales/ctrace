# cTrace
![Release](https://img.shields.io/badge/release-v1.1.7-alpha)
![Docker](https://img.shields.io/badge/docker-cgtrace/ctrace-blue?link=https://hub.docker.com/repository/docker/cgtrace/ctrace&style=for-the-badge)

Contact Tracing and Reporting Application

#### Installation

Copy `.env.example` to `.env` in the root directory of your installation and modify the example config to suit your needs. You'll also need an [Auth0](https://auth0.com) account as well as a MongoDB database from a service like [Atlas](https://www.mongodb.com/cloud/atlas). You might need to copy/paste the `.env` values into the environment variable settings if you're running cTrace on a cloud service.

To enforce a data retention policy, connect to your MongoDB database and run `db.people.createIndex({"createdAt": 1}, {expireAfterSeconds: 2592000})` to instruct the Mongo daemon to delete objects after 30 days.

cTrace is also available as a Docker image after configuring an `.env` file.  
