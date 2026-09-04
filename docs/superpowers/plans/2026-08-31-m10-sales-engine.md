# M10 Sales Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build Academy OS commerce around real offers, orders, subscriptions, coupons, affiliate commissions, governed refunds, financial analytics, and MCP receipts without replacing the existing Laravel/Stripe core.

**Architecture:** Keep `Enrollment` as the learning-access projection and add a commerce ledger around it. Stripe Checkout remains the payment surface; destination charges carry platform fees; webhook handlers project paid/canceled/refunded events into `AcademyOrder`, `AcademyMembership`, `AcademyRefund`, and `AffiliateCommission`. Financial mutations are exposed through M08 MCP only as governed SENSITIVE tools.

**Tech Stack:** Laravel 13, Stripe PHP 17, Cashier 16, React 19/Inertia 3, PostgreSQL/pgvector 17, Redis, Coolify.

**Spec:** M10 scope agreed in conversation: member subscriptions, tiers/freemium, coupons, platform commissions, Stripe Connect, affiliate, governed refunds, MRR/churn/LTV/conversion, MCP approvals/receipts.

## Global Constraints

- Keep existing `app + postgres + redis` Coolify topology.
- Do not add new npm/composer dependencies.
- Do not fabricate historical revenue or conversion data.
- Existing M01-M09 features must remain compatible.
- All financial MCP mutations are SENSITIVE and require strong approval.
- ZIP source release must exclude `vendor`, `node_modules`, caches, fonts and secrets.

---

### Task 1: Commerce ledger and access projection

**Files:** create M10 migration/models; modify `Enrollment`, `Course`, `Module`, `User`.

- [x] Add course offers, orders, memberships, refunds, affiliates, commissions, coupons and trainer commerce settings.
- [x] Add `offer_id`/`access_rank` to enrollment and `minimum_access_rank` to modules.
- [x] Add model relationships/casts.
- [x] Verify PHP syntax and contract.

### Task 2: Checkout and Stripe fee engine

**Files:** create `CommerceService`, modify public course checkout/webhooks.

- [x] Resolve free/one-time/subscription offers.
- [x] Apply coupons and affiliate metadata.
- [x] Use `application_fee_amount` for one-time destination charges.
- [x] Use `application_fee_percent` + destination for subscriptions.
- [x] Project checkout completion into order/membership/enrollment.
- [x] Handle subscription canceled/updated and invoice paid events.

### Task 3: Affiliate and coupon lifecycle

**Files:** trainer sales controllers/routes/UI.

- [x] Create/deactivate coupons and affiliate links.
- [x] Track attributed paid orders and accrued commission ledger.
- [x] Never auto-payout affiliates in M10.

### Task 4: Governed refund engine

**Files:** create `RefundService`; MCP registry/executor; trainer controller.

- [x] Support full/partial refund by order.
- [x] Use Stripe Refund API with `reverse_transfer` and `refund_application_fee` for destination charges.
- [x] Persist refund status and update order refunded totals.
- [x] Expose `sales.refund` as SENSITIVE MCP tool with typed confirmation.

### Task 5: Financial analytics

**Files:** create `CommerceAnalyticsService`; sales controller/UI; MCP.

- [x] Calculate recorded gross, refunds, net revenue, platform fees, affiliate commissions.
- [x] Calculate checkout conversion from recorded order attempts.
- [x] Calculate MRR from active memberships normalized by billing interval.
- [x] Calculate churn from membership cancellations and realized LTV from recorded net revenue / buyers.
- [x] Keep metrics grouped by currency when currencies differ.

### Task 6: Tier access enforcement

**Files:** student course controller, public resource, progress/note/tutor retrieval paths.

- [x] Hide/redact modules above enrollment access rank.
- [x] Prevent progress/notes/tutor retrieval for tier-locked lessons.
- [x] Preserve free preview behavior for public users.

### Task 7: QA, docs, release

**Files:** feature tests, contract test, README/release docs, package version.

- [x] Observe M10 contract RED before implementation and GREEN after.
- [x] Add Laravel feature tests for fees, free offers, subscription projection, coupon/affiliate, tier lock and refund policy.
- [x] Run PHP syntax, Prettier, ESLint, TypeScript classification, Compose parse, secret/font/dependency scans.
- [x] Probe Pest/Vite and document environmental blockers honestly.
- [x] Package v0.10.0, SHA-256, fresh extract and rerun release gate.
