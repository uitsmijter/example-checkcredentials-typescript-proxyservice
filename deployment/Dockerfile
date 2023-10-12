FROM node:20.6.0-bullseye as buildstage

MAINTAINER aus der Technik

RUN apt-get update; apt-get upgrade -y; apt-get install -y \
    curl

ADD package.json yarn.lock /opt/build/
WORKDIR /opt/build
RUN yarn install

ADD tsconfig.json tslint.json /opt/build/
ADD src /opt/build/src
ADD prisma /opt/build/prisma

RUN yarn audit --production
RUN yarn test
RUN yarn build
RUN yarn install --production
RUN cp -r /opt/build/node_modules /opt/build/dist

# ----------------------------------------------------------------------------------------
FROM node:20.6.0-slim as runtime

RUN mkdir -p /opt/app

RUN addgroup service \
	&& useradd -g service --no-create-home app

COPY --from=buildstage --chown=app:service /opt/build/dist /opt/app/
WORKDIR /opt/app

EXPOSE 3000
USER app

WORKDIR "/opt/app"
ENTRYPOINT ["node", "/opt/app/server.js"]
