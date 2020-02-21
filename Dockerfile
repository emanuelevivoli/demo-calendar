# This defines our starting point
FROM node:10.9.0

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@8

COPY . .

# EXPOSE 4200/tcp
CMD ng serve --port 4321
