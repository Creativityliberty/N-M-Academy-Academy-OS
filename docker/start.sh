#!/bin/sh
set -e

cd /var/www/html

echo "=== [start] Checking APP_KEY ==="
if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Set it in Coolify ENV (Runtime only)."
    exit 1
fi

echo "=== [start] Running migrations ==="
# Retry up to 5 times to tolerate slow DB startup
i=1
while [ $i -le 5 ]; do
    php artisan migrate --force && break
    echo "Migration attempt $i failed, retrying in 5s..."
    sleep 5
    i=$((i + 1))
done
php artisan migrate --force  # final attempt — will exit 1 on failure

echo "=== [start] Storage link ==="
php artisan storage:link --force 2>/dev/null || true

echo "=== [start] Bootstrap instance ==="
php artisan academy:bootstrap-instance --no-interaction || true

echo "=== [start] Caches ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== [start] Knowledge reindex (missing only) ==="
php artisan academy:knowledge-reindex --missing --no-interaction || true

echo "=== [start] Starting supervisord ==="
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
