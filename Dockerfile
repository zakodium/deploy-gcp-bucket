FROM node:16

# Install Google Cloud SDK
# See https://cloud.google.com/sdk/docs/install#deb
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y

WORKDIR /script
RUN chown node:node /script
USER node
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY login.js deploy.js ./

CMD ["tail", "-f", "/dev/null"]
