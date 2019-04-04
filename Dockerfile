FROM google/cloud-sdk:alpine

RUN apk add --update nodejs npm

WORKDIR /script

COPY package*.json /script/
RUN npm ci

COPY login.js deploy.js /script/

CMD ["tail", "-f", "/dev/null"]
