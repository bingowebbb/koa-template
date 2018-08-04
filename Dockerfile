FROM hub.duxze.com/devops/busybox:latest
RUN mkdir /artifacts
WORKDIR /artifacts
COPY ./bin          ./bin/
COPY ./config       ./config/
COPY ./routes       ./routes/
COPY ./public       ./public/
COPY ./node_modules ./node_modules
COPY ./views        ./views
ADD  ./index.js     ./
ADD  ./package.json ./
ADD  ./webpack.config.js ./
ADD  ./yarn.lock ./
