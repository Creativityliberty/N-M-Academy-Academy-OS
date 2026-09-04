#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"

require_file(){ test -f "$1" || { echo "M10 missing file: $1" >&2; exit 1; }; }
require_text(){ grep -Fq "$2" "$1" || { echo "M10 missing '$2' in $1" >&2; exit 1; }; }

require_file app/Models/CourseOffer.php
require_file app/Models/AcademyOrder.php
require_file app/Models/AcademyMembership.php
require_file app/Models/AcademyCoupon.php
require_file app/Models/AffiliatePartner.php
require_file app/Models/AffiliateCommission.php
require_file app/Models/AcademyRefund.php
require_file app/Services/Commerce/CheckoutService.php
require_file app/Services/Commerce/RefundService.php
require_file app/Services/Commerce/CommerceAnalyticsService.php
require_file database/migrations/2026_08_31_180000_create_academy_commerce_tables.php
require_file tests/Feature/Commerce/SalesEngineTest.php

require_text app/Services/Commerce/CheckoutService.php application_fee_amount
require_text app/Services/Commerce/CheckoutService.php application_fee_percent
require_text app/Services/Commerce/RefundService.php reverse_transfer
require_text app/Services/Commerce/RefundService.php refund_application_fee
require_text app/Mcp/AcademyMcpToolRegistry.php sales.refund
require_text app/Mcp/AcademyMcpToolRegistry.php coupons.create
require_text app/Mcp/AcademyMcpToolRegistry.php affiliates.create
require_text app/Http/Controllers/Student/Courses/CourseController.php access_rank
require_text app/Http/Resources/Public/CourseResource.php minimum_access_rank
require_text docker-compose.coolify.yml pgvector/pgvector:
grep -Eq '"version": "(0\.(1[0-9]|[2-9][0-9])|[1-9][0-9]*\.)' package.json || { echo 'M10 requires package version >= 0.10.0' >&2; exit 1; }

require_text app/Services/Commerce/CheckoutService.php "gross === 0"
require_text app/Services/Commerce/CommerceWebhookService.php recurring_amount
require_text app/Services/Commerce/RefundService.php refunded_platform_fee_amount
require_text app/Models/AffiliateCommission.php reversed_amount
require_text app/Services/Commerce/CommerceWebhookService.php AffiliateCommission::firstOrCreate
require_text app/Services/Commerce/AccessProjectionService.php "whereIn('status',['active','trialing','past_due'])"
require_text app/Http/Controllers/Student/Courses/CourseController.php minimum_access_rank
require_text routes/trainer.php coupons.toggle
require_text routes/trainer.php affiliates.toggle

echo "M10 SALES ENGINE CONTRACT PASS"
