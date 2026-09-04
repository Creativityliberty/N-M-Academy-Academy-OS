# =============================================================================
# Stage 0 — Canonical Node.js runtime
# =============================================================================
# Keep Docker aligned with GitHub Actions and packages that require Node >=24.
FROM node:24-alpine AS node-runtime

# =============================================================================
# Stage 1 — PHP + Composer dependencies
# =============================================================================
FROM php:8.4-cli-alpine AS composer-deps

COPY --from=mlocati/php-extension-installer:latest /usr/bin/install-php-extensions /usr/local/bin/

RUN apk add --no-cache git curl zip unzip libstdc++ \
    && install-php-extensions bcmath exif gd intl mbstring pcntl pdo pdo_mysql pdo_pgsql zip redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install dependencies before copying source (layer cache optimization)
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-interaction \
        --optimize-autoloader \
        --prefer-dist

COPY . .

# Discover packages (|| true — APP_KEY not needed at this stage)
RUN php artisan package:discover --ansi 2>/dev/null || true

# =============================================================================
# Stage 2 — Node.js asset + SSR bundle build
# =============================================================================
# Reuse composer-deps: PHP 8.4 + extensions + vendor + artisan already present.
# Wayfinder runs `php artisan wayfinder:generate` during the Vite build.
FROM composer-deps AS node-build

COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=node-runtime /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node-runtime /usr/local/bin/npx /usr/local/bin/npx
COPY --from=node-runtime /usr/local/lib/node_modules /usr/local/lib/node_modules

ENV NODE_OPTIONS="--max-old-space-size=1536"

RUN node --version \
    && npm --version \
    && npm ci --include=dev --prefer-offline

# Wayfinder boots Laravel during the Vite build. Use a throwaway sqlite env only
# in this build stage; production runtime secrets remain external to the image.
RUN echo "APP_KEY=base64:g0YUU+MCrOxxpOl9DvjDHGP4A/XwmY5Hiwzjf7p/lFk=" > .env \
    && echo "APP_ENV=local" >> .env \
    && echo "APP_URL=http://localhost" >> .env \
    && echo "DB_CONNECTION=sqlite" >> .env \
    && echo "DB_DATABASE=/tmp/build_wayfinder.sqlite" >> .env \
    && touch /tmp/build_wayfinder.sqlite

# Builds both client bundle (public/build) and SSR bundle (bootstrap/ssr)
RUN npm run build:ssr

# =============================================================================
# Stage 3 — Production image (PHP-FPM + Nginx + Supervisor)
# =============================================================================
FROM php:8.4-fpm-alpine AS production

LABEL maintainer="pmindfull"

# Runtime system dependencies
RUN apk add --no-cache \
        nginx \
        supervisor \
        curl \
        poppler-utils \
        libstdc++ \
    && rm -rf /var/cache/apk/*

COPY --from=mlocati/php-extension-installer:latest /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions bcmath exif gd intl mbstring pcntl pdo pdo_mysql pdo_pgsql opcache zip redis

# Inertia SSR requires Node at runtime; keep the same Node 24 binary used for build.
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node

# PHP configuration
COPY docker/php/php.ini        "$PHP_INI_DIR/conf.d/99-app.ini"
COPY docker/php/opcache.ini    "$PHP_INI_DIR/conf.d/10-opcache.ini"
COPY docker/php/php-fpm.conf   /usr/local/etc/php-fpm.d/www.conf

# Nginx
COPY docker/nginx/nginx.conf   /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf
COPY docker/supervisor/conf.d/          /etc/supervisor/conf.d/

WORKDIR /var/www/html

# Application source (copied in order of change frequency)
COPY --chown=www-data:www-data . .
COPY --from=composer-deps --chown=www-data:www-data /app/vendor        ./vendor
COPY --from=node-build    --chown=www-data:www-data /app/public/build  ./public/build
COPY --from=node-build    --chown=www-data:www-data /app/bootstrap/ssr ./bootstrap/ssr

# Ensure storage directories exist with correct permissions
RUN mkdir -p \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 755 storage bootstrap/cache \
    && mkdir -p /run/nginx \
    && mkdir -p /var/lib/nginx/tmp/client_body \
    && chown -R www-data:www-data /var/lib/nginx \
    && chmod -R 755 /var/lib/nginx

COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -fsS http://127.0.0.1/up || exit 1

CMD ["/usr/local/bin/start.sh"]
