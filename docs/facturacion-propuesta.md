# Facturación — proposal (not built)

Status: **plan only**. Nothing here is implemented. The current Ventas module prints non-fiscal tickets and says so
on the ticket. This document is what we would build if you confirm, and what it commits us to legally.

Legal references are to Spanish law as we understand it in October 2026. **Have the gestoría confirm the
points marked ⚖ before we build**, especially dates and thresholds, which have changed more than once.

---

## 1. What Evelyn asked for

- **Facturas completas** with the client's fiscal data (name, DNI/NIF, address).
- **Facturas simplificadas** (a "ticket") when the client gives no fiscal data.
- The fields on her current invoice: number, date; client name, DNI/NIF and address; lines with concepto,
  cantidad, base (sin IVA), IVA 21 % and total; then base imponible, IVA and total; and an issuer block with
  business name, owner name, NIF and address.
- **Two issuers** with their own data and series:
  - **ECNF HERITAGE SLU** (company): its series **starts at 1**.
  - **Evelyn Fernández Alva** (autónoma): her series continues from her current number, **2050**, so the next
    invoice is **2051**.
  - Every invoice and every simplified invoice lets them **choose the issuer**.

## 2. Data model

All tables are additive, created by `setup-db.ts` like the rest of gestión.

| Table | Purpose |
|---|---|
| `emisores` | One row per issuer: razón social / nombre, NIF, domicilio fiscal (street, CP, city, province), owner name (for the SLU's administrator line), email/phone for the header, IVA regime, `activo`. Edited in **Ajustes → Facturación**. |
| `series_factura` | Per issuer: `codigo` (e.g. `A`, `S` for simplificadas, `R` for rectificativas), `tipo` (`completa` / `simplificada` / `rectificativa`), `prefijo` shown on the document, `siguiente_numero`, `reinicio_anual` (yes/no). Starting number editable in Ajustes **until the first invoice of that series is issued**, then locked. |
| `facturas` | The issued document. Stores a **snapshot** of the issuer and client data (not just ids), so editing a client or the issuer later never changes a past invoice. Totals, IVA breakdown, `serie`, `numero`, `fecha_expedicion`, `fecha_operacion` if different, origin (`venta_id` / `encargo_id` / `encargo_pago_id`), `rectifica_factura_id`, and the Verifactu fields (§6). |
| `factura_lineas` | concepto, cantidad, precio unitario sin IVA, descuento, base, tipo IVA, cuota, total. |
| `facturas_registro` | The Verifactu record chain (§6): one row per *registro de alta* or *anulación*, with its hash and AEAT response. |

**Numbering.** Each series is a counter row taken under `SELECT … FOR UPDATE` inside the issuing transaction, the
same pattern as `contadores` for sales today. That gives no gaps and no duplicates, even with two people
invoicing at once. Example numbers:

- Evelyn, autónoma: `2051`, `2052`, … (or `EFA-2051` if she wants a prefix; the number keeps running from 2050).
- ECNF HERITAGE SLU: `1`, `2`, … (or `ECNF-2026-0001` if they prefer a yearly series).

⚖ Whether to restart each year is their choice. A series must stay correlative and must not be reused within
the same issuer.

## 3. Issuing and immutability

- **Draft → issued.** An invoice can be edited while it's a draft and has no number. Issuing assigns the number
  and date, takes the snapshots, computes the hash and makes the row **immutable**.
- **Immutability is enforced in the database**, as the stock ledger already is: a trigger rejects `UPDATE` and
  `DELETE` on issued invoices and their lines. The only later changes allowed are the Verifactu send status
  fields, written by the sending process.
- **Corrections only by factura rectificativa.** The rectificativa goes in its own series (`R`) and references the
  original's series, number and date, and the reason. It works by differences (negative lines), or by substitution
  where the law allows. Each issuer has its own R series.
- **No deleting.** An invoice issued by mistake is cancelled with a rectificativa. (Verifactu also has a
  *registro de anulación*; §6 explains when each applies.)
- **PDF.** Rendered from the snapshot, with the issuer block, client block, lines, IVA breakdown per rate and the
  Verifactu QR. Downloadable, and printable on A4 or on the 80 mm ticket printer.

## 4. Facturas simplificadas

- Required fields: series and number, date, issuer NIF and name, description of the goods or service, the IVA rate
  (or the words "IVA incluido"), and the total.
- If the client is a business and asks, the simplified invoice also carries their NIF and address and the IVA
  amount shown separately.
- ⚖ **Amount limit.** In general, a simplified invoice is allowed up to **€400 including IVA**. Retail sales
  (*ventas al por menor*) and some listed activities may go up to **€3,000**. Accessories sold in the shop are
  retail sales. Whether bespoke tailoring counts as one of those activities is for the gestoría to confirm. Above
  the limit, the app would require a full invoice with the client's data.
- They get their own series per issuer (`S`), separate from full invoices.
- A Venta in the shop would offer "Factura simplificada" in place of today's non-fiscal ticket. ⚖ Once the
  system issues invoices, every sale must get one, and the non-fiscal ticket stays only as a delivery note
  (albarán).

## 5. Where invoices come from

- **Ventas**: one sale → one invoice (full or simplified) from the chosen issuer. Returns of accessories → a
  rectificativa.
- **Encargos**: ⚖ IVA becomes payable on **advance payments** (the *señal*). So each encargo payment should get an
  invoice (or simplified invoice) for that payment, and the final invoice deducts the advances already invoiced.
  The encargo's Pagos list would show the invoice number next to each payment. This is the point with the
  most practical impact on how Evelyn works today; the gestoría should confirm it.
- **Manual invoice** for anything else (services billed later, B2B).

The issuer is chosen on every document. The app can remember a default per user or per kind of document,
but the choice stays visible every time.

## 6. Verifactu readiness

Verifactu is the AEAT regime for invoicing software: Real Decreto 1007/2023 (Reglamento de requisitos de los
sistemas informáticos de facturación, RRSIF) and Orden HAC/1177/2024.

⚖ **Dates.** After the late-2025 postponement, the obligation applies from **1 January 2027** to taxpayers under
Impuesto sobre Sociedades (**ECNF HERITAGE SLU**), and from **1 July 2027** to the rest, autónomos included
(**Evelyn**). Confirm these dates; they have moved before. Both issuers are in scope, each with its own NIF and
its own record chain.

We would build the **VERI\*FACTU** mode: every record is sent to AEAT as it is created. That mode avoids the
electronic signature of each record and the event log that the non-sending mode requires.

What the software must do for each issued invoice:

1. **Registro de facturación de alta.** A structured record: issuer NIF, series and number, date, type (F1
   complete, F2 simplified, R1–R5 rectificativas), recipient if any, IVA breakdown, total, and the system data.
2. **Hash chaining.** The record's *huella* is a SHA-256 of its key fields plus the previous record's huella, one
   chain per issuer. Altering or deleting any past record breaks the chain. We store the huella with the invoice
   and never recompute it.
3. **QR code and legend on the invoice.** The QR encodes the AEAT verification URL with the issuer NIF, number,
   date and total, and the invoice carries the text *"Factura verificable en la sede electrónica de la AEAT"*
   (VERI\*FACTU). The customer can scan it to check the invoice with AEAT.
4. **Sending to AEAT.** The AEAT web service (SOAP/XML), authenticated with an electronic certificate:
   - Each issuer needs a certificate, or must authorise us (or the gestoría) to send for them.
   - Records are sent in batches (up to the AEAT batch limit), respecting the wait time AEAT returns between
     sends.
   - Rejections are kept and corrected with a *subsanación* record.
   - A send queue retries on failure. An invoice is never blocked from being handed to the client because AEAT is
     down; the record is queued and sent later, which the regulation allows.
   - Every response is stored in `facturas_registro`.
5. **Registro de anulación** for an invoice that should never have existed, such as a duplicate. Ordinary
   corrections remain rectificativas.
6. **Testing** against the AEAT pre-production environment before go-live, with a test certificate.

Before go-live we also need (§7):

- The system identification (name, ID, version, producer NIF) inside every record.
- The producer's *declaración responsable*.

## 7. Our obligations as the software's producer

Whoever develops and maintains this system for the shop (RyvoDigital, or whoever signs as producer) becomes the
**productor del sistema informático de facturación**:

- **Declaración responsable** (RRSIF art. 13; content set by Orden HAC/1177/2024). A signed statement that the
  system complies, included in the software and visible to the user. It names:
  - the system and its version;
  - the producer's name and NIF;
  - the components and the way it is distributed.
  
  It is updated with every version that affects compliance.
- **Build-time guarantees** the declaration attests to:
  - integrity and immutability of records;
  - traceability through the chain;
  - preservation and accessibility of records;
  - legibility;
  - no hidden features that allow records to be altered or deleted ("software de doble uso").
- **Sanctions.** ⚖ Ley General Tributaria art. 201 bis:
  - Producing or selling a non-compliant system can be fined **up to €150,000 per year** for each kind of
    system.
  - The **user** (the shop) can be fined up to **€50,000 per year** for using one.
  - This exposure is why we'd build Verifactu fully or not at all.
- **Ongoing duty.** Follow changes to the AEAT technical specifications and the web service, release updates in
  time, and keep the declaration current.

The alternative is for the shop to keep invoicing in an external Verifactu-certified program and import the
invoice numbers into the app. That avoids all of §7 for us. It's worth costing before deciding.

## 8. Ajustes → Facturación (screens)

- **Emisores**: create and edit both issuers' fiscal data, plus an "activo" switch. Changes apply only to
  invoices issued afterwards (snapshots).
- **Series per issuer**: code, prefix, type, next number (editable until the first invoice in that series), yearly
  restart.
- **Verifactu per issuer**: certificate or authorisation status, mode, last send and errors (when §6 is built).
- Only Propietarios see these screens. Empleados never see invoices, because they carry prices.

## 9. Proposed phases (after your confirmation)

1. **F1** Issuers and series in Ajustes, the invoice data model, immutability trigger, and draft → issue for full
   and simplified invoices from Ventas. PDF. *(No Verifactu yet, so not usable for real invoicing until F3–F4
   if the obligation already applies.)*
2. **F2** Rectificativas; invoices for encargo payments and the final invoice with advances deducted.
3. **F3** Verifactu records: chain, QR, legend, and system identification.
4. **F4** Sending to AEAT (pre-production, then production), certificates, queue and retries.
5. **F5** Declaración responsable, documentation, and go-live before the deadline of the first issuer to be
   affected (the SLU).

## 10. Questions for Evelyn / the gestoría

1. Exact fiscal data of both issuers (as on the census), and the IVA regime of each.
2. Does her current numbering (2050) use a prefix or year? Should the SLU restart its series each year?
3. Which issuer invoices what: shop sales, bespoke garments, arreglos? Is there a usual default?
4. ⚖ Simplified-invoice limit for bespoke tailoring: €400 or €3,000?
5. ⚖ Invoicing of señales (advance payments) on encargos: per payment, as described in §5?
6. Do both issuers have an electronic certificate, or should the gestoría send records for them?
7. Who signs the declaración responsable as producer?
