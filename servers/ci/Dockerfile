FROM node
RUN git clone https://github.com/cs3org/ocm-test-suite
WORKDIR ocm-test-suite
RUN git checkout dev
RUN npm ci
RUN HEADLESS=1 npm install
