FROM nextcloud
ENV HOST=nc1
RUN ln -s /tls/$HOST.crt /tls/server.cert
RUN ln -s /tls/$HOST.key /tls/server.key
USER www-data
RUN OC_PASS=relativity php ./console.php user:add --password-from-env einstein
USER root
