FROM node
RUN apt-get update && apt-get install -yq \
  vim \
  && apt-get clean
ADD tester/package.json .
RUN npm install
ADD tester .
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
CMD npm run jest
