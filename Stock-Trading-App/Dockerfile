#FROM --platform=linux/x86-64 python:3.9

# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install --silent

# add app
COPY . /app/

# start app
EXPOSE 3000
CMD ["npm", "start"] 