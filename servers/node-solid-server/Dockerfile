    
FROM node:8.11.2
RUN git clone https://github.com/solid/node-solid-server
RUN git clone https://github.com/solid/oidc-rs
RUN git clone https://github.com/solid/oidc-op
RUN git clone https://github.com/solid/oidc-auth-manager
WORKDIR oidc-rs
RUN git checkout newToken
RUN npm i
WORKDIR ../oidc-op
RUN git checkout newToken
RUN npm i
WORKDIR ../oidc-auth-manager
RUN git checkout newToken
RUN npm i
RUN npm link ../oidc-rs
RUN npm link ../oidc-op
WORKDIR ../node-solid-server
RUN git checkout newToken
RUN npm install
RUN npm link ../oidc-rs
RUN npm link ../oidc-op
RUN npm link ../oidc-auth-manager
ADD config.json .
ADD config ./config
ADD data ./data
ADD .db ./.db
ADD tls ./tls
EXPOSE 8443
CMD ./bin/solid-test start
