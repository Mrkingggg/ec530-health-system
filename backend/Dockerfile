# Dockerfile for Flasks
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make the container's port 5000 available to the outside
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
