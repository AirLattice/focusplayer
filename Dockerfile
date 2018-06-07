FROM ubuntu:14.04

RUN cd /etc/apt && \
    sed -i 's/archive.ubuntu.com/ftp.daum.net/g' sources.list

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUM mkdir /var/www

ADD app.js /var/www/app.js
ADD package.json /var/www/package.json

WORKDIR /var/www
RUN npm install
 
CMD nodejs app.js

