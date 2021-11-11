FROM apache-php
RUN apt install -y zip
RUN rm -rf /var/www/html
USER www-data
WORKDIR /var/www
RUN git clone https://github.com/pondersource/server
RUN cd server && git checkout dynamic-shareproviders
RUN mv server html
WORKDIR /var/www/html
RUN git submodule update --init
ENV PHP_MEMORY_LIMIT="512M"
RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN php console.php app:disable firstrunwizard
RUN git clone https://github.com/pondersource/nc-sciencemesh apps/sciencemesh
# RUN cd apps/sciencemesh && git checkout with-nextcloud-sciencemesh-branch
RUN cd apps/sciencemesh && make
RUN php console.php app:enable sciencemesh

RUN sed -i "8 i\      1 => 'nc1.docker'," /var/www/html/config/config.php
RUN sed -i "9 i\      2 => 'nc2.docker'," /var/www/html/config/config.php
USER root
