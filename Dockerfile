# Use the latest Node.js image as the base
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current directory to the /app directory in the container
COPY . /app

# Install dependencies (assuming package.json and package-lock.json are present)
RUN npm install


CMD node index.js