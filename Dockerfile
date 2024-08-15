# # Use the official Node.js image.
# # The image tag should match the version you're using.
# FROM node:18

# # Set the working directory.
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json.
# COPY package*.json ./

# # Install dependencies.
# RUN npm install

# # Copy the rest of your application code.
# COPY . .

# # Expose the port your app runs on.
# EXPOSE 3000

# # Start the application.
# CMD ["npm", "start"]

##

# # Stage 1: Build the application
# FROM node:18 AS build

# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the application (if applicable, e.g., TypeScript)
# # RUN npm run build

# # Stage 2: Run the application
# FROM node:18

# WORKDIR /usr/src/app

# # Copy the built application and dependencies from the build stage
# COPY --from=build /usr/src/app /usr/src/app

# # Expose port
# EXPOSE 3000

# # Start the application
# CMD ["npm", "start"]

##

# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Optionally build the application if using TypeScript or other build steps
# RUN npm run build

# Stage 2: Run the application
FROM node:18

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from the build stage
COPY --from=build /usr/src/app/package*.json ./

# Install dependencies in the final image
RUN npm install --only=production

# Copy the rest of the application code from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
