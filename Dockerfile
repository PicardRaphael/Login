FROM oclock/static-nginx-nodejs:v2
COPY package.json yarn.lock /home/src/
WORKDIR /home/src
RUN yarn --pure-lockfile --non-interactive
COPY . /home/src/
# RUN yarn build:prod
# RUN mkdir -p /var/www/ && cp -r dist/* /var/www/
CMD [ "yarn", "start:docker" ]