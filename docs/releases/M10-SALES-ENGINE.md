# M10 — Sales Engine

M10 replaces price-derived sales approximations with an explicit Academy commerce ledger while preserving `Enrollment` as the learning-access projection.

## Commerce primitives

- `CourseOffer`: free, one-time or subscription offer with access rank.
- `AcademyOrder`: immutable-ish checkout/payment snapshot in minor currency units.
- `AcademyMembership`: subscription projection with actual recurring amount, status and period dates.
- `AcademyCoupon`: internal fixed/percentage discounts with redemption limits and expiry.
- `AffiliatePartner` + `AffiliateCommission`: attribution and accrued commission ledger; no automatic payout in M10.
- `AcademyRefund`: governed refund request linked to the originating order and optional MCP receipt.
- `TrainerCommerceSetting`: platform fee, default affiliate rate and commerce currency per trainer.

## Stripe Connect

One-time destination charges use `application_fee_amount` and subscriptions use `application_fee_percent` with `transfer_data.destination`.

Refunds use both `reverse_transfer=true` and `refund_application_fee=true`. Partial refunds therefore project proportional transfer/application-fee reversals into the local ledger. Failed or canceled refunds are excluded from the effective refunded amount.

## Truthful analytics

The Creator Sales workspace derives metrics only from recorded commerce events:

- gross and refunded revenue by currency;
- net recorded revenue;
- net platform fees after proportional refund projection;
- net accrued affiliate commissions after refund reversal;
- checkout conversion from recorded checkout attempts;
- MRR from the actual recurring membership amount rather than the catalog offer price;
- active memberships and monthly churn;
- realized LTV from recorded net revenue per recorded buyer.

Pre-M10 enrollments remain visible as legacy history and never become fabricated revenue.

## Tiered access

`CourseOffer.access_rank` projects to `Enrollment.access_rank`. `Module.minimum_access_rank` gates paid tiers server-side across course rendering, progress, notes and Tutor retrieval. Student library progress and “next lesson” calculations ignore modules above the student’s current rank.

## Member subscriptions

Students have a `Mes abonnements` workspace showing recurring amount, status and current period. Billing changes are handed to Stripe Billing Portal rather than reimplementing payment-method/cancellation UI in Academy OS.

## Affiliate lifecycle

Public `?ref=` attribution is captured in a secure HTTP-only cookie. Trainers can create and activate/deactivate affiliates. Paid initial and renewal subscription orders can accrue commissions. Refunds reverse accrued commission proportionally.

## Governed refunds

Trainer UI and MCP both require explicit confirmation. MCP exposes `sales.refund` as SENSITIVE/destructive/open-world and carries the MCP execution `receipt_id` into `academy_refunds`.

## M10 MCP additions

- `offers.create`
- `coupons.create`
- `affiliates.create`
- `memberships.list`
- `sales.refund`

Financial refund execution remains strongly approved and auditable.

## Coolify

No new service is introduced. The deployment remains:

```text
app
postgres (pgvector PostgreSQL 17)
redis
```
