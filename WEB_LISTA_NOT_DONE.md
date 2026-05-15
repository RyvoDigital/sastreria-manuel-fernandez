# WEB LISTA — ITEMS STILL NOT DONE

## 🔴 NEEDS ASSETS / DECISIONS FROM CLIENT

### 1. Google Reviews rotating carousel
**Doc says:** "I don't know why they aren't rotating from one to another... we wanted it to connect directly with the Google ones, which are real."
**Status:** Fake Josh Nicolás review removed, badge links to real Google Maps. But we never built a rotating carousel that pulls real Google reviews.
**What we need:** Google Places API key to fetch real reviews, OR the client provides screenshots of real reviews to display manually.

### 2. Before/After photos
**Doc says:** "The before and after shows the same photo with basting stitches."
**Status:** Reverted to original pre-WEB LISTA images (`fitting-vest` / `camel-jacket-form`).
**What we need:** A real before/after pair of the SAME CLIENT — one photo before the fitting, one photo after (wearing the finished suit).

### 3. THE REPERTOIRE — 10 service photos
**Doc says:** "add photos to each service."
**Status:** Dates removed from all 10 services.
**What we need:** 10 photos (1 per service) to display in the repertoire grid:
1. Traje a Medida
2. Blazer
3. Pantalón Sport
4. Abrigo Artesanal
5. Traje de Novio
6. Camisas
7. Chalecos
8. Arreglos a Medida
9. (check full list in component)

### 4. Bank details for videollamada
**Doc says:** "The bank details section for requesting the video call is not ready yet."
**Status:** Email backend built. No bank details section exists.
**What we need:** Client's bank account info (IBAN, account holder name, bank name) to display on the videollamada page.

### 5. Online Courses — 6 different photos
**Doc says:** "Change all photos."
**Status:** All 6 course thumbnails currently use the SAME `cursos-overview` image.
**What we need:** 6 different photos (1 per course).

### 6. Product photos
**Doc says:** Lists 7 product images (morning coat, stroller, tuxedo, artisan suit, artisan coat, blazer, shirts).
**Status:** Uploaded to Cloudinary but NOT used anywhere — no products showcase component exists.
**What we need:** A decision — do we build a product grid/showcase on the Servicios page, or are these for individual product pages?

### 7. "Create your suit" image
**Doc says:** `create-your-suit.jpg` listed.
**Status:** Uploaded but not used anywhere on the site.
**What we need:** Where should this image go?

---

## 🟡 TECHNICAL / CONFIGURATION

### 8. Resend domain verification (emails not arriving)
**Doc says:** "when you request it, no email reaches us."
**Status:** Resend backend works for testing (sends to account email).
**What we need:** The owner must verify their domain at https://resend.com/domains — otherwise Resend blocks emails to arbitrary recipients. Currently only works when `CONTACT_EMAIL` = the Resend account email.

---

## ✅ ALREADY FIXED
- "Hand-sewn" → "Handmade" in all 4 languages
- Schedule corrected (Mon–Fri 10–14 & 17–20, Sat 10–13, Sun closed)
- All "Book Appointment" buttons now link to `/contacto`
