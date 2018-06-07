FROM ubuntu:14.04

RUN cd /etc/apt && sed -i 's/archive.ubuntu.com/ftp.daum.net/g' sources.list && sed -i 's/archive.ubuntu.com/ftp.daum.net/g' sources.list.d/proposed.list

RUN apt-get update
RUN apt-get install -y nodejs npm

ADD ./ /var/www/

WORKDIR /var/www
RUN npm install

CMD nodejs app.js

