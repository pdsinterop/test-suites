php console.php maintenance:install --admin-user $USER --admin-pass $PASS --database "mysql" --database-name "nextcloud" --database-user "root" --database-pass "1234" --database-host "$DBHOST"
php console.php app:disable firstrunwizard
php console.php app:enable sciencemesh
sed -i "8 i\      1 => 'nc1.docker'," /var/www/html/config/config.php
sed -i "9 i\      2 => 'nc2.docker'," /var/www/html/config/config.php
