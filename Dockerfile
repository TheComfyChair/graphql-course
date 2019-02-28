FROM node:10

# $DEF_USER = app, it is defined in the previous image
WORKDIR /home/app/application-code

USER root

EXPOSE 4000