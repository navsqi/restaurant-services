# Food Ordering System

This repository contains assessment task project for PT. Usaha Kreatif Indonesia. It's a microservices-based application built as a demonstration of technical skills for Full-stack Developer position.

The system consists of three services:

- **Order Service**
- **Kitchen Service**
- **Notification Service**

## Tech Stack

- **Backend**: NestJS, TypeORM
- **Monorepo**: NX
- **Database**: MySQL
- **Messaging**: RabbitMQ
- **Notifications**: SMTP for email
- **API Documentation**: Swagger
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js (v22)
- MySQL (local or remote)
- RabbitMQ (local or remote)
- SMTP server for email notifications

### Local Setup

1. **Clone the repository**

```bash
git clone https://github.com/navsqi/restaurant-services.git
cd restaurant-services
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment files**

```bash
cp .env.example .env
cp apps/order-service/.env.example apps/order-service/.env
cp apps/kitchen-service/.env.example apps/kitchen-service/.env
cp apps/notification-service/.env.example apps/notification-service/.env
```

4. **Configure environment variables**

Adjust the `.env` files with your local configuration for:

- MySQL database connection
- RabbitMQ connection
- SMTP server details

> **Note**: For cloud credentials, contact: nauvalsh@gmail.com

5. **Run database migrations and seed data**

```bash
npm run migration:run
```

6. **Start the services**

```bash
# Start Order Service
npm run dev:order-service

# Start Kitchen Service
npm run dev:kitchen-service

# Start Notification Service
npm run dev:notification-service
```

### API Documentation

Each service has Swagger documentation available at:

- Order Service: http://localhost:3001/docs
- Kitchen Service: http://localhost:3002/docs
- Notification Service: http://localhost:3003/docs

## Docker Setup

If you prefer running the application using Docker:

1. **Configure Docker environment**

Edit the environment variables in `docker-compose.yml`

> **Note**: For cloud credentials, contact: nauvalsh@gmail.com

2. **Start the containers**

```bash
docker-compose up
```

This will start all services, including MySQL, RabbitMQ, and the three application services.

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Order Service  │◄────►│ Kitchen Service │◄────►│ Notification    │
│  (Port: 3001)   │      │  (Port: 3002)   │      │  Service        │
│                 │      │                 │      │  (Port: 3003)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘

```

## Service Communication

- **RabbitMQ Exchanges & Queues**:
  - `orders` exchange (fanout)
  - `order.process` queue
  - `order.confirmation` queue

## Development

## Troubleshooting

If you encounter any issues:

1. Ensure all environment variables are correctly set
2. Check that MySQL and RabbitMQ are running and accessible
3. Verify that the ports (3001, 3002, 3003) are not in use by other applications
4. For SMTP issues, ensure your email provider credentials are correct

## Contact

For cloud credentials or any questions:

- Email: nauvalsh@gmail.com
