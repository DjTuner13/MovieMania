# MovieMania Project

The MovieMania Project allows users to create a library of movies to:

- Add movies to a Watch Later backlog.
- Store movies already watched for cataloging and future recommendations.
- Get recommendations based on their current list of "watch later" movies.

## About Architecture

This project is built using Flask, a lightweight WSGI web application framework in Python, and MongoDB Atlas, a fully-managed cloud database service.

## Prerequisites

Before installing the MovieMania Project, ensure you have the following prerequisites installed on your system:

- Python 3.12 or higher
  - You can check your Python version by running `python --version` in your terminal.
  - If you need to install Python, visit [python.org](https://www.python.org/downloads/) for download instructions.
- pipenv
  - pipenv can be installed via pip by running `pip install pipenv`. For more detailed installation instructions, visit the [pipenv documentation](https://pipenv.pypa.io/en/latest/install/#installing-pipenv).

## Installation

To install the MovieMania Project, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/DjTuner13/MovieMania.git
   ```

2. Navigate to the project directory:

   ```bash
   cd MovieMania
   ```

3. Use pipenv to create a virtual environment and install the required dependencies:

   ```bash
   pipenv install
   ```

## Setup

Before running the server, you need to create a `.env` file in the root of the project directory with the following layout:

```bash
MONGODB_USERNAME=YOUR_USERNAME_HERE
MONGODB_PASSWORD=YOUR_PASSWORD_HERE
```

Replace `YOUR_USERNAME_HERE` and `YOUR_PASSWORD_HERE` with your actual MongoDB username and password.

## Running the Application

To run the MovieMania Project, follow these steps:

1. Activate the pipenv shell to ensure you are using the project's virtual environment:

   ```bash
   pipenv shell
   ```

2. Start the application:

   ```bash
   python app.py
   ```

3. Open your web browser and navigate to `http://localhost:5000` to view the application.

## Contributing

We welcome contributions to the MovieMania Project! To contribute, please follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/DjTuner13/MovieMania.git
   ```

2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b your-branch-name
   ```

3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to the repository:

   ```bash
   git push origin your-branch-name
   ```

5. Create a pull request from your branch to the main branch.

Please ensure your code adheres to the project's coding standards and includes appropriate tests. If you have any questions, feel free to open an issue on GitHub.

Thank you for contributing!

Contributors
   Eric Robinson
   Haley Marvasi