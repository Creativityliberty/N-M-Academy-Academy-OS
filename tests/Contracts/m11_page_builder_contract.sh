#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
require(){ test -e "$1" || { echo "MISSING $1"; exit 1; }; }
contains(){ grep -Fq -- "$2" "$1" || { echo "MISSING_PATTERN $1 :: $2"; exit 1; }; }
for f in app/Models/AcademyPage.php app/Models/AcademyPageSection.php app/PageBuilder/PageBlockRegistry.php app/PageBuilder/PageSectionResolver.php app/Http/Controllers/Trainer/PageBuilderController.php app/Http/Controllers/Public/AcademyPageController.php resources/js/pages/trainer/pages/index.tsx resources/js/pages/trainer/pages/edit.tsx resources/js/pages/home/pages/show.tsx tests/Feature/PageBuilder/PageBuilderTest.php; do require "$f"; done
for block in hero features instructor course curriculum testimonials pricing faq cta footer; do contains app/PageBuilder/PageBlockRegistry.php "'$block'"; done
contains app/PageBuilder/PageSectionResolver.php 'CourseOffer::query()'
contains app/PageBuilder/PageSectionResolver.php "where('is_active', true)"
contains app/PageBuilder/PageBlockRegistry.php 'sanitizeSettings'
contains app/PageBuilder/PageBlockRegistry.php 'safeUrl'
contains app/AI/AcademyAiCapabilityRegistry.php 'page.generate'
contains app/AI/AcademyAiCapabilityRegistry.php 'page.optimize'
contains app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php 'replacePageSections'
contains resources/js/pages/trainer/pages/edit.tsx 'draggable'
contains resources/js/pages/trainer/pages/edit.tsx 'sections/reorder'
contains resources/js/components/page-builder/page-renderer.tsx '/checkout?offer='
contains routes/public.php 'academy-pages.show'
grep -Eq '"version": "(0\.(1[1-9]|[2-9][0-9])|[1-9][0-9]*\.)' package.json || { echo 'M11 requires package version >= 0.11.0'; exit 1; }
echo 'M11 PAGE BUILDER CONTRACT PASS'
