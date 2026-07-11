---
name: Calculator country config
description: Country-specific VAT rates and delivery prices stored in site_settings
---
Countries: Poland (23%), Lithuania (21%), Latvia (21%), Estonia (24%), Germany (19%), Czech Republic (21%), Belarus (customs 15% + excise 5%).
Delivery: Western Europe (DE) = €800, Eastern Europe = €600. Service fee = €500.
All stored as site_settings rows with keys like calculator.vat.poland, calculator.delivery.western_europe, etc.
Belarus: uses calculator.belarus.customs_rate + calculator.belarus.excise_rate + calculator.belarus.registration_docs.
**Why:** Client spec requires all calculator values editable via CMS without code changes.
**How to apply:** When modifying calculator, read from /api/site-settings not hardcoded values.
