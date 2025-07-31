# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## How to Run the Application (Linux)

Follow these steps to set up and run the application on a Linux terminal.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js and npm:** It is recommended to use a Node.js version compatible with Next.js (e.g., Node.js 18.x or later).
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
*   **Docker and Docker Compose:** The application relies on Docker for managing bot containers.
    ```bash
    # Install Docker (follow official Docker documentation for your specific Linux distribution)
    # Example for Ubuntu:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0555 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Add your user to the docker group to run Docker commands without sudo
    sudo usermod -aG docker $USER
    newgrp docker # You might need to log out and log back in for this to take effect
    ```

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the project if it doesn't exist. This file should contain your application's environment variables. For the demo, the default credentials are:
    ```
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=password
    SESSION_SECRET=a-very-secret-key-that-should-be-in-env
    ```
    **Note:** For production, change `ADMIN_PASSWORD` and `SESSION_SECRET` to strong, unique values.

### Running the Application

#### Development Mode

To run the application in development mode (with hot-reloading and debugging features):

```bash
npm run dev
```
The application will typically run on `http://localhost:3000`.

#### Production Mode

To build the application for production and then run it:

1.  **Build the application:**
    ```bash
    npm run build
    ```

2.  **Start the application:**
    ```bash
    npm run start
    ```

#### Using Docker Compose

For a more streamlined setup, you can use Docker Compose to build and run the application.
This method is recommended as it handles dependencies and environment setup automatically.

1.  **Build and run the application with Docker Compose:**
    ```bash
    docker compose up --build
    ```
    This command will:
    *   Build the Docker image for the application.
    *   Start the application container.
    *   Mount the host's Docker socket into the container, allowing the application to manage bot containers.
    *   Persist the application's data (`db.json`) in a `data/` directory on your host.

2.  **Stop the application (optional):**
    ```bash
    docker compose down
    ```

### Database Information

The application uses `lowdb` for a simple file-based database. The database file `db.json` is located in the `data/` directory at the root of the project. This directory is ignored by Git.

### Troubleshooting

*   If you encounter issues with Docker, ensure the Docker daemon is running (`sudo systemctl start docker`) and your user is part of the `docker` group.
*   If changes are not reflecting, try restarting the development server.
*   Check the terminal for any error messages or `console.log` outputs for debugging.
