FROM node
RUN apt-get update && apt-get install -yq \
  vim \
  && apt-get clean
ADD tester .
RUN npm install
CMD npm run jest
