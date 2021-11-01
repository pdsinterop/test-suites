FROM node
# Trust all the certificates:
ADD tls /tls
RUN cp /tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
RUN git clone https://github.com/cs3org/ocm-test-suite
WORKDIR ocm-test-suite
RUN git checkout dev
RUN npm ci
RUN HEADLESS=1 npm run debug
