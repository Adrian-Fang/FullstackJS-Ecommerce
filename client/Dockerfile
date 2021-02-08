FROM node

# Less messages during docker build
ENV NPM_CONFIG_LOGLEVEL warn

# All subsequent commands will now be run from inside this folder
RUN mkdir -p /app
WORKDIR /app
COPY ./ ./
RUN npm install
EXPOSE 80