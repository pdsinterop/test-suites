FROM node
RUN apt-get update && apt-get install -yq \
  vim \
  && apt-get clean
ADD tester-base /app
WORKDIR /app
RUN npm install
ADD tester/test /app/test
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
CMD npm run jest
