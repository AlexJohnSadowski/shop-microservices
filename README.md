
# 🚀 REST microservices
![Alt text](/public/images/diagram.png)

## About This Project
NOT FOR PROD!
This is a repository designed as a playground for a variety of technologies in the realm of REST microservices. 
It's a perfect test bed for tinkering with Redis, RabbitMQ, NGINX configurations, and it's even Kubernetes-friendly.
Primarily for educational and developmental purposes.

Also a custom JWT is implemented, so for the actual prod just use Clerk or something similar with asymmetric key (cuz here I just used a symmetric one to quickly set it up) and authenticate the microservices with the zero trust policy with the public key stored in cached or something - this one was just for fun.
And yeah, left the .env file, so it would be easier for ya to run it quickly.

### 🧩 Technologies Used

- **Express**: Building RESTful microservices
- **PostgreSQL & Prisma & Zod**: Robust database management and ORM.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.
- **NGINX**: HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server.
- **Docker**: Containerization of microservices.
- **RabbitMQ**: Advanced message queuing protocol.
- **Zod**: TypeScript-first schema validation with static type inference.
- **JWT (Custom Implementation)**: For the local version and 4fun only, don't trust this one and use some auth0, lol

### 🚀 Getting Started

To get this project up and running on your local machine:

1. Clone the repository.
2. Navigate to the project directory.
3. Use Docker Compose to build and run the services:

   ```bash
   docker-compose -f docker-compose.dev.yml up
   docker-compose -f docker-compose.dev.yml build
   ```

### 📚 Documentation

Further documentation detailing each microservice, database schemas, API endpoints, and configuration settings can be found in the respective directories.

