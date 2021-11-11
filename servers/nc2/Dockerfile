FROM nextcloud
ENV HOST=nc2
RUN ln -s /tls/$HOST.crt /tls/server.cert
RUN ln -s /tls/$HOST.key /tls/server.key
USER www-data
RUN OC_PASS=radioactivity php ./console.php user:add --password-from-env marie
USER root
