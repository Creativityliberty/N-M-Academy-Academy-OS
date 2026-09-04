#!/bin/sh
set -e

cd /var/www/html

php artisan migrate --force
php artisan storage:link --force 2>/dev/null || true
php artisan academy:bootstrap-instance --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue initial Tutor knowledge indexing for courses migrated from pre-M09 releases.
# Existing indexed courses are skipped, so normal deployments remain cheap.
php artisan academy:knowledge-reindex --missing --no-interaction

exec /usr/bin/supervisord -n -c /etc/supervisord.conf
