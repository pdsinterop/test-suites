#!/bin/bash
php console.php maintenance:install --admin-user alice --admin-pass alice123
php console.php status
php console.php app:enable solid
sed -i '66 i\  RewriteRule ^\\.well-known/openid-configuration /app/solid/openid.php [QSA,L]' .htaccess
