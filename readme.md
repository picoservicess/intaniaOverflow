# IntaniaOverflow

Engineering students in Chulalongkorn University which also known as Intania students encounter questions or concerns, such as technical issues related to their courses, how to register for subjects, or where to find resources, but often struggle to find answers. Additionally, some students have valuable solutions or insights they want to share but lack a dedicated platform to do so within the faculty.

## Functional Requirements

### Registration System

1. The system shall allow Chula Engineering’s students to create a new account with Chula's email and password.

2. The system shall allow student to fill in his/her profile information, including name, major, and year class.

### Login System

1. The system shall allow the registered user to log in.

2. The system shall allow the logged-in user to log out.

### Thread Management System

1. The system shall allow a logged-in user to create a thread.

2. The thread shall include a title, description, file attachment, tags, user identity and vote.

3. The system shall allow a logged-in user to choose whether to display their identity in their thread.

4. The system shall allow a logged-in user to edit their thread.

5. The system shall allow a logged-in user to delete their thread.

### Reply Management System

1. The system shall allow a logged-in user to create a reply to a thread.

2. The reply shall include a description, file attachment, user identity and vote.

3. The system shall allow a logged-in user to choose whether to display their identity in their reply.

4. The system shall allow a logged-in user to edit their reply.

5. The system shall allow a logged-in user to delete their reply.

### Searching System

1. The system shall allow logged-in user to see all threads.

2. The system shall allow logged-in user to search the threads by title and tags.

### Voting System

1. The system shall allow a logged-in user to vote on a thread as "useful" or "not useful."

2. The system shall allow a logged-in user to vote on a reply as "useful" or "not useful."

3. The system shall prioritize threads with higher "useful" votes at the top of search results.

4. The system shall prioritize replies with higher "useful" votes at the top of the thread’s replies.

### Profile System

1. The system shall allow the log-in user to view their thread.

2. The system shall allow the log-in user to view their pinned threads.

3. The system shall notify the log-in user when one of their threads receives a reply.

4. The system shall notify the log-in user when a reply is made to one of their pinned threads.

## Architecture

The architecture of the IntaniaOverflow application follows a microservices pattern. Each service communicates with others through well-defined APIs, typically using REST or gRPC. The services are designed to be stateless and can be deployed in a containerized environment using Docker.

## Services

- API Gateway
- Asset Service
- Logging Service
- Notification Service
- Reply Service
- Thread Service
- User Service
- Voting Service
- RabbitMQ
- PostgresQL
- Grafana
- Nginx Load Balancer

## Getting Started

To get started with the IntaniaOverflow microservices, follow these steps:

1. **Set up the environment:**
   Ensure you have Docker installed and configured on your machine. And find your own `.env` at root directory.

2. **Build and run the services:**
   ```sh
   docker-compose up --build
   ```

## Usage

Each service exposes a set of endpoints that can be accessed via HTTP or gRPC. Refer to the documentation within each service's directory for detailed API specifications and usage examples.
