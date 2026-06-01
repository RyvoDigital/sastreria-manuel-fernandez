# Admin Panel + Frontend Integration — Test Plan

## 1. Authentication

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Go to `/admin` | Redirects to `/admin/login` |
| 1.2 | Enter wrong password | Error message, stays on login page |
| 1.3 | Enter `admin@sastreria.com` / `Sastreria2025!` | Redirects to `/admin/dashboard` |
| 1.4 | Click logout | Session cleared, redirect to login |
| 1.5 | Try accessing `/admin` after logout | Redirects to login |

---

## 2. Dashboard Overview

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Log in and land on dashboard | See stats cards (bookings, contacts, submissions) |
| 2.2 | Check sidebar navigation | Dashboard, Bookings, Contacts, Configs, Content, Settings, Analytics |
| 2.3 | Verify no public nav/footer visible on admin pages | Clean admin-only UI |

---

## 3. Settings (Prices + Feature Toggles)

### 3.1 Price Changes
| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1.1 | Go to `/admin/settings` | See all services with prices and toggles |
| 3.1.2 | Change **Cursos** price from 350 → 400 | Save success message |
| 3.1.3 | Open `/cursos` in incognito | Price shows €400 (not €350) |
| 3.1.4 | Click "Ver Curso" → payment gate | Price shows €400 |
| 3.1.5 | Try Stripe checkout (test card) | Checkout shows €400.00 |
| 3.1.6 | Change back to 350 | Revert confirmed |

### 3.2 Videocall Price
| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.2.1 | Change **Videollamada** price from 50 → 75 | Save success |
| 3.2.2 | Go to `/contacto` | Videocall section shows €75 |
| 3.2.3 | Try booking a videocall | Stripe checkout shows €75.00 |
| 3.2.4 | Revert to 50 | Confirmed |

### 3.3 Configurator Price
| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.3.1 | Change **Configurador** price from 29 → 35 | Save success |
| 3.3.2 | Go to `/configurador` | Payment gate shows €35 |
| 3.3.3 | Try Stripe checkout | Shows €35.00 |
| 3.3.4 | Revert to 29 | Confirmed |

---

## 4. Feature Toggles (Enable/Disable Services)

### 4.1 Disable a Service
| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1.1 | In `/admin/settings`, toggle **Modelos 3D** to OFF | Save success |
| 4.1.2 | Open homepage | "Modelos 3D" gone from navigation |
| 4.1.3 | Scroll to footer | "Modelos 3D" gone from footer |
| 4.1.4 | Try direct URL `/modelos-3d` | Shows "Próximamente" page (not 404) |
| 4.1.5 | Toggle back to ON | Reappears everywhere |

### 4.2 Disable Multiple Services
| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.2.1 | Turn OFF: Cursos, Configurador, Videollamada | Save |
| 4.2.2 | Check homepage nav | Only remaining services visible |
| 4.2.3 | Check footer | Matches nav |
| 4.2.4 | Try direct URLs | All show "Próximamente" |
| 4.2.5 | Turn all back ON | Site fully restored |

### 4.3 Disable Contact
| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.3.1 | Toggle **Contacto** OFF | Save |
| 4.3.2 | Check nav/footer | Contact link hidden |
| 4.3.3 | Try `/contacto` directly | "Próximamente" page |
| 4.3.4 | Revert | Restored |

---

## 5. Content Management (CMS)

### 5.1 Hero Text
| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1.1 | Go to `/admin/content` | See editable fields |
| 5.1.2 | Edit `hero.title` → "Sastrería de Élite" | Save |
| 5.1.3 | Open homepage | Hero shows new title |
| 5.1.4 | Edit `hero.subtitle` → "Trajes únicos desde 1990" | Save |
| 5.1.5 | Refresh homepage | New subtitle visible |
| 5.1.6 | Revert to original text | Confirmed |

### 5.2 Contact Details
| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.2.1 | Edit `contact.phone` → "+34 600 00 00 00" | Save |
| 5.2.2 | Go to `/contacto` | Phone shows new number |
| 5.2.3 | Edit `contact.address` → "Calle Nueva 123, Madrid" | Save |
| 5.2.4 | Refresh `/contacto` | New address visible |
| 5.2.5 | Edit `business.hours` → "Lun-Vie: 10:00-20:00" | Save |
| 5.2.6 | Refresh | Hours updated |
| 5.2.7 | Revert all | Confirmed |

---

## 6. Bookings Management

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6.1 | Go to `/admin/bookings` | List of all bookings |
| 6.2 | Create a booking from `/contacto` (public) | Appears in admin within seconds |
| 6.3 | Click a booking | See details (name, email, date, time, type) |
| 6.4 | Edit booking status | Change "confirmed" → "completed" |
| 6.5 | Filter by status | Only matching bookings shown |
| 6.6 | Delete a booking | Confirms, then removes |

---

## 7. Contact Submissions

| Step | Action | Expected Result |
|------|--------|-----------------|
| 7.1 | Submit contact form on `/contacto` | Success message |
| 7.2 | Go to `/admin/contacts` | New submission appears |
| 7.3 | Mark as read | Read status toggles |
| 7.4 | Filter by read/unread | Works correctly |
| 7.5 | Delete submission | Confirms, then removes |

---

## 8. Configurator Submissions

| Step | Action | Expected Result |
|------|--------|-----------------|
| 8.1 | Complete configurator on `/configurador` | Submit success |
| 8.2 | Go to `/admin/configurations` | New config appears |
| 8.3 | View config details | Fabric, measurements, design options visible |
| 8.4 | Change status | "new" → "in_progress" → "completed" |
| 8.5 | Add notes | Notes saved and visible |

---

## 9. Analytics

| Step | Action | Expected Result |
|------|--------|-----------------|
| 9.1 | Go to `/admin/analytics` | 4 charts load |
| 9.2 | Booking trends chart | Shows data points over time |
| 9.3 | Services pie chart | Breakdown by booking type |
| 9.4 | Contacts bar chart | Volume by type |
| 9.5 | Configs bar chart | Status distribution |
| 9.6 | Create new booking + contact | Charts update on refresh |

---

## 10. Payments / Stripe

| Step | Action | Expected Result |
|------|--------|-----------------|
| 10.1 | Try checkout with NO price sent | Returns 400 "Invalid or missing price" |
| 10.2 | Try checkout with price = 0 | Returns 400 error |
| 10.3 | Try checkout with price = -10 | Returns 400 error |
| 10.4 | Valid checkout (test card) | Stripe session created, redirect works |
| 10.5 | Cancel checkout | Returns to cancel URL |
| 10.6 | Successful payment | Webhook updates status |

---

## 11. Frontend Integration (End-to-End)

### 11.1 Full Flow: Course Purchase
| Step | Action | Expected Result |
|------|--------|-----------------|
| 11.1.1 | Change course price in admin | Saved |
| 11.1.2 | Open `/cursos` in new tab | New price visible |
| 11.1.3 | Click "Ver Curso" | Payment gate shows new price |
| 11.1.4 | Click Stripe pay | Checkout amount matches |
| 11.1.5 | Complete test payment | Success page shown |
| 11.1.6 | Check admin bookings | New booking appears |

### 11.2 Full Flow: Service Toggle + Direct Access
| Step | Action | Expected Result |
|------|--------|-----------------|
| 11.2.1 | Disable "Bodas y Ceremonia" | Saved |
| 11.2.2 | Homepage: no "Bodas" in nav | Confirmed |
| 11.2.3 | Old bookmark `/bodas-y-ceremonia` | Shows "Próximamente" (graceful, not 404) |
| 11.2.4 | Re-enable | Back to normal |

---

## 12. Multi-language Check

| Step | Action | Expected Result |
|------|--------|-----------------|
| 12.1 | Switch site to English | All dynamic content still works |
| 12.2 | Switch to French | Same |
| 12.3 | Switch to Italian | Same |
| 12.4 | Admin stays in English | Admin UI language stable |

---

## Test Data Cleanup

After testing, revert all changes:
- Settings prices back to defaults (350, 50, 29)
- All toggles back to ON
- CMS content back to original
- Delete test bookings/contacts/configs

---

## Quick Smoke Test (5 minutes)

If you just want a quick check:
1. Log into `/admin`
2. Change course price to 999
3. Open `/cursos` → see €999
4. Toggle Modelos 3D OFF
5. Refresh homepage → gone from nav
6. Revert both changes
7. Done ✅
