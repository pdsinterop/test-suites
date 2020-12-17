FROM seafileltd/seafile:latest
RUN sed -i '89 s/^.*$/    return true/' /scripts/bootstrap.py
RUN openssl req -new -x509 -days 365 -nodes \
  -out /shared/ssl/server.crt \
  -keyout /shared/ssl/server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=server"
EXPOSE 443
