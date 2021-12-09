php console.php maintenance:install --admin-user $USER --admin-pass $PASS --database "mysql" --database-name "nextcloud" --database-user "root" --database-pass "1234" --database-host "$DBHOST"
php console.php app:disable firstrunwizard
php console.php app:enable sciencemesh
