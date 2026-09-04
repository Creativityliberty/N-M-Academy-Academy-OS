une table category

---

courses

┌─────────────────────────┬────────────────────┬───────────────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ trainer_id │ FK users │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
├─────────────────────────┼────────────────────┼───────────────────────┤
│ title │ string │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ slug │ string unique │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ description │ text │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ price │ decimal(8,2) │ │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ duration │ string │ "6h de contenu" │
├─────────────────────────┼────────────────────┼───────────────────────┤
├─────────────────────────┼────────────────────┼───────────────────────┤
│ image │ string │ URL │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ featured │ boolean │ default false │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ published_at │ timestamp nullable │ null = brouillon │
├─────────────────────────┼────────────────────┼───────────────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴────────────────────┴───────────────────────┘

---

modules

┌─────────────────────────┬─────────────┬─────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼─────────────┼─────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼─────────────┼─────────────┤
│ course_id │ FK courses │ │
├─────────────────────────┼─────────────┼─────────────┤
│ title │ string │ │
├─────────────────────────┼─────────────┼─────────────┤
├─────────────────────────┼─────────────┼─────────────┤
│ order │ unsignedInt │ │
├─────────────────────────┼─────────────┼─────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴─────────────┴─────────────┘

---

lessons

┌─────────────────────────┬───────────────────┬─────────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼───────────────────┼─────────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼───────────────────┼─────────────────┤
│ module_id │ FK course_modules │ │
├─────────────────────────┼───────────────────┼─────────────────┤
│ title │ string │ │
├─────────────────────────┼───────────────────┼─────────────────┤
├─────────────────────────┼───────────────────┼─────────────────┤
│ is_free │ boolean │ preview gratuit │
├─────────────────────────┼───────────────────┼─────────────────┤
│ order │ unsignedInt │ │
├─────────────────────────┼───────────────────┼─────────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴───────────────────┴─────────────────┘

---

reviews

┌─────────────────────────┬────────────┬───────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼────────────┼───────┤
│ id │ bigint PK │ │
├─────────────────────────┼────────────┼───────┤
│ course_id │ FK courses │ │
├─────────────────────────┼────────────┼───────┤
│ user_id │ FK users │ │
├─────────────────────────┼────────────┼───────┤
│ rating │ tinyint │ 1 à 5 │
├─────────────────────────┼────────────┼───────┤
│ text │ text │ │
├─────────────────────────┼────────────┼───────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴────────────┴───────┘

▎ Unique sur (course_id, user_id) — un avis par étudiant par cours.

---

purchases

┌─────────────────────────┬────────────────────┬──────────────────────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ user_id │ FK users │ │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ course_id │ FK courses │ │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ amount │ decimal(8,2) │ prix au moment de l'achat │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ stripe_payment_id │ string nullable │ │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ status │ enum │ pending, completed, refunded │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ paid_at │ timestamp nullable │ │
├─────────────────────────┼────────────────────┼──────────────────────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴────────────────────┴──────────────────────────────┘

▎ Unique sur (user_id, course_id) — un seul achat par cours.

---

trainer_applications

┌─────────────────────────┬────────────────────┬─────────────────────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ user_id │ FK users nullable │ si déjà inscrit │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ first_name │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ last_name │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ email │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ phone │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ country │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ specialty │ string │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ experience │ text │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ certifications │ text nullable │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ status │ enum │ pending, approved, rejected │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ reviewed_at │ timestamp nullable │ │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ reviewed_by │ FK users nullable │ admin qui a validé │
├─────────────────────────┼────────────────────┼─────────────────────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴────────────────────┴─────────────────────────────┘

---

trainer_subscriptions

┌─────────────────────────┬────────────────────┬────────────────────────────┐
│ Colonne │ Type │ Notes │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ id │ bigint PK │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ user_id │ FK users │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ plan │ enum │ starter, pro, expert │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ price │ decimal(8,2) │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ status │ enum │ active, cancelled, expired │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ stripe_subscription_id │ string nullable │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ starts_at │ timestamp │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ ends_at │ timestamp nullable │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ cancelled_at │ timestamp nullable │ │
├─────────────────────────┼────────────────────┼────────────────────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴────────────────────┴────────────────────────────┘

---

Récapitulatif des relations

users ──< courses (un formateur a plusieurs cours)
users ──< purchases (un étudiant a plusieurs achats)
users ──< reviews (un étudiant laisse des avis)
users ──< trainer_applications
users ──< trainer_subscriptions

---

Ce qu'on laisse de côté pour l'instant (à ajouter quand tu attaqueras le dashboard) : progress (pr ├─────────────────────────┼─────────────┼─────────────┤
│ order │ unsignedInt │ │
├─────────────────────────┼─────────────┼─────────────┤
│ created_at / updated_at │ timestamp │ │
└─────────────────────────┴─────────────┴─────────────┘

-

Stripe Connect est exactement le bon outil. Voici le process :

---

Stripe Connect — comment ça marche ici

Stripe Connect permet à une plateforme (toi) de gérer des paiements pour le compte de tiers (les formateurs).

2 flux distincts :

1. Achat d'un cours par un étudiant → argent au formateur
   Stripe Connect "Destination Charges" : l'étudiant paye, Stripe envoie directement sur le compte Stripe du formateur, et tu prends  
   une commission au passage (ex: 20%). Le formateur doit avoir créé un compte Stripe Connect (onboarding guidé par Stripe).

2. Abonnement du formateur à la plateforme
   Stripe Billing classique : le formateur s'abonne, tu factures son compte Stripe directement. Pas de Connect ici, c'est une relation
   directe plateforme ↔ formateur.

---

Le process concret :

1. Formateur s'inscrit → tu lui fais faire l'onboarding Stripe Connect (lien généré par ton backend, Stripe gère KYC/vérification  
   identité)
2. Formateur est vérifié → son stripe_account_id est stocké dans ta DB
3. Étudiant achète un cours → Stripe Charge avec transfer_data.destination = stripe_account_id du formateur, tu gardes ta commission
4. Formateur paye son abonnement → Stripe Subscription classique sur le customer du formateur

---

Type de compte Connect à choisir :

- Express (recommandé) : Stripe gère l'UI d'onboarding et le dashboard formateur, toi tu n'as presque rien à construire
- Custom : tu construis tout toi-même, plus flexible mais beaucoup plus de travail

Express est le bon choix pour démarrer vite.

---

Quand tu veux partir sur le code, dis-le.

C'est le seul. Stripe gère tout via son SDK officiel.

---

Ce qu'il faut construire — dans l'ordre :

---

Étape 1 — Migrations

Tu auras besoin d'ajouter sur la table users (ou une table trainer_profiles) :

- stripe_account_id — l'ID du compte Connect Express du formateur (acct_xxx)
- stripe_onboarding_completed (boolean) — true quand Stripe confirme que le formateur a tout rempli
- stripe_customer_id — pour la partie abonnement du formateur (Stripe Billing)

---

Étape 2 — Parcours "Devenir formateur"

Le flow complet :

1. L'utilisateur soumet une demande (formulaire : bio, expérience, etc.) → table
   trainer_applications
2. L'admin approuve depuis le panel → l'utilisateur reçoit le rôle trainer
3. Le formateur arrive sur son dashboard → bannière "Configurez votre compte de paiement pour  
   publier des cours"
4. Il clique → ton backend appelle Stripe pour créer un compte Connect Express + génère un lien  
   d'onboarding Stripe
5. Stripe redirige vers son interface hébergée (Stripe gère KYC, IBAN, identité)
6. Après onboarding, Stripe redirige vers ton return_url (ex: /trainer/stripe/return)
7. Ton backend vérifie via webhook account.updated si details_submitted = true → marque
   stripe_onboarding_completed = true

---

Étape 3 — Abonnement du formateur

Après Connect validé, le formateur souscrit à son abonnement mensuel :

1. Créer un stripe_customer_id pour le formateur
2. Stripe Checkout ou Payment Element pour collecter sa CB
3. Stripe Subscription → webhook invoice.payment_succeeded pour activer/renouveler

---

Étape 4 — Achat cours par un étudiant (après)

Ce sera plus simple une fois le Connect en place : tu fais une charge avec transfer_data.destination
= stripe_account_id et tu définis ton application_fee_amount.

---

Résumé de ce qu'on code en premier :

1. Migration stripe_account_id + stripe_onboarding_completed + stripe_customer_id sur users
2. Table trainer_applications
3. Formulaire candidature formateur
4. Panel admin : liste des candidatures + bouton approuver
5. Dashboard formateur : bouton "Configurer paiement" → Connect Express onboarding
6. Webhook handler (1 endpoint) pour account.updated

Tu veux qu'on commence par les migrations et la candidature formateur ?

✻ Churned for 24s

※ recap: On construit un système de paiement Stripe Connect pour que les formateurs reçoivent
directement l'argent des cours. La prochaine étape est d'installer `stripe/stripe-php` puis créer  
 les migrations et la table `trainer_applications`.

---

Note importante : pour la production, l'événement checkout.session.completed n'est pas dans la liste
par défaut de cashier:webhook. Il faudra l'ajouter manuellement dans le Dashboard Stripe ou passer  
 --events à la commande :
php artisan cashier:webhook --events=checkout.session.completed,customer.subscription.created,...

C'est plusieurs sujets distincts, laisse-moi répondre à chaque point avant de coder :

---

Flow étudiant — achat de cours
Même logique que le trainer : pas connecté → register → redirect direct vers checkout Stripe → webhook → accès au cours.
Implémentable maintenant.

---

L'argent part chez le prof directement — Stripe Connect
On utilise un destination charge : la plateforme traite le paiement, prend une commission (ex: 20%), et le reste part
automatiquement sur le compte Connect du prof :
'payment_intent_data' => [
'application_fee_amount' => $platformFee, // en centimes
'transfer_data' => ['destination' => $trainer->stripe_account_id],
],

---

Risque si le prof n'a pas configuré son compte Connect
Si stripe_account_id est null ou onboarding non complété → la charge échoue avec une erreur Stripe. L'argent ne se perd pas (la  
 transaction ne part pas), mais l'étudiant voit une erreur. Solution : empêcher l'achat d'un cours si le prof n'a pas fini son  
 onboarding Connect — côté backend avant de créer la session.

---

Comment le prof récupère son argent
Via le Stripe Express Dashboard — on génère un lien de connexion côté backend :
$loginLink = \Stripe\Account::createLoginLink($trainer->stripe_account_id);
return redirect($loginLink->url);
Ce lien emmène le prof sur son dashboard Stripe personnel où il gère ses virements, voit ses revenus, et configure son RIB.

---

Tu veux qu'on commence par quoi ? Je suggère dans cet ordre :

1. Flow achat cours étudiant (checkout + accès après paiement)
2. Stripe Connect destination charges (argent → prof)
3. Lien dashboard Stripe pour le prof

Tout est créé. Voici le résumé complet :

---

Structure des fichiers Docker :
Dockerfile ← 3 stages: composer / node / production
.dockerignore ← exclut .env, vendor, node_modules, etc.
docker/ nginx/nginx.conf ← config principale nginx
nginx/default.conf ← vhost Laravel (avec buffers Inertia)
php/php.ini ← paramètres PHP prod
php/opcache.ini ← OPcache optimisé
php/php-fpm.conf ← pool www-data, port 9000
supervisor/supervisord.conf ← config principale
supervisor/conf.d/
10-php-fpm.conf ← PHP-FPM
20-nginx.conf ← Nginx
30-ssr.conf ← Inertia SSR (port 13714)
40-queue.conf ← 2 queue workers
50-scheduler.conf ← scheduler Laravel (loop /60s)

---

Dans Coolify, configure :

┌───────────────────┬───────────────────────────────────────────────────────────────────────────┐  
 │ Champ │ Valeur │  
 ├───────────────────┼───────────────────────────────────────────────────────────────────────────┤  
 │ Build Pack │ Dockerfile │  
 ├───────────────────┼───────────────────────────────────────────────────────────────────────────┤  
 │ Ports Exposes │ 80 │  
 ├───────────────────┼───────────────────────────────────────────────────────────────────────────┤  
 │ Pre-deploy │ php artisan migrate --force && php artisan storage:link && php artisan │  
 │ command │ optimize │  
 └───────────────────┴───────────────────────────────────────────────────────────────────────────┘

Variables d'environnement obligatoires :
APP*ENV=production
APP_DEBUG=false
APP_URL=https://ton-domaine.com
APP_KEY=base64:... ← génère avec: php artisan key:generate --show
DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
IMAGEKIT*\_, STRIPE\_\_

---

Sources :

- Coolify Laravel Docs (https://coolify.io/docs/applications/laravel)
- Production-Ready Laravel + Inertia SSR on Coolify
  (https://insafnilam.hashnode.dev/deploying-laravel-inertia-ssr-mysql-on-coolify)
- Laravel Queues with Coolify and Supervisord
  (https://frontier.sh/posts/20240509-laravel-queues-coolify/)
- Docker Production Setup — Docker Docs
  (https://docs.docker.com/guides/frameworks/laravel/production-setup/)
