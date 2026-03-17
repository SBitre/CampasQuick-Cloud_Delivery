# ================================
# Stage 1 - BUILD
# Use Node.js to install dependencies and build the React app
# ================================
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency files first (for better layer caching)
# This way npm install only re-runs if package.json changes
COPY package.json package-lock.json .

# Install all dependencies listed in package.json
RUN npm install

# Copy the rest of the app source code (src/, public/, etc.)
COPY . .

# Build the React app into static files (output goes to /app/build)
RUN npm run build


# ================================
# Stage 2 - SERVE
# Use Nginx to serve the built static files to the browser
# We don't need Node.js anymore, just the build/ folder
# ================================
FROM nginx:alpine

# Copy only the build output from Stage 1 into Nginx's serving folder
COPY --from=builder /app/build /usr/share/nginx/html

# Tell Docker that Nginx listens on port 80
EXPOSE 80