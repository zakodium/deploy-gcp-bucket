# deploy-gcp-bucket

Docker image used to deploy GCP buckets on a server.

## Configuration with Docker Compose

In `docker-compose.yml`, add a service with a configuration as the following:

```yml
services:
  deploy-front:
    image: zakodium/deploy-gcp-bucket
    environment:
      # Name of the Google Cloud Storage bucket that holds the releases.
      DEPLOY_BUCKET_NAME: my-release-bucket
      # Subdirectory that will contain every synced version.
      DEPLOY_DIRECTORY: releases
      # After each deployment, a symbolic link will be created in
      # `/data/${DEPLOY_SYMLINK}`. It will point to the last deployed version.
      DEPLOY_SYMLINK: current
    volumes:
      # Map local directory that will contain the releases.
      - ./www:/data
      # Map service account key
      - ./gcp-key.json:/gcp-key.json
```

## Login

You need to launch the login command once every time the container is recreated:

```console
docker-compose exec deploy-front node login
```

## Deploy

```console
docker-compose exec deploy-front node deploy v1.0.0
```
