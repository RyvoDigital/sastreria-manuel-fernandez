# Gestión: data model (phase A0)

Status: **proposal for review**. No app code or schema has been written yet.
Branch `feat/gestion`, baseline `main` @ `1ee98e5`.

The modules: Clientes · Citas · Encargos · Taller · Inventario · Ventas · Proveedores · Informes.

---

## 0. Recon findings that shape the design

### 0.1 Preview and Production share ONE database ⚠️

`vercel env` for project `sastreria-manuel-fernandez` has a single `DATABASE_URL`
entry (`DFhxXhXYscqnUK2y`) targeted at **both `preview` and `production`**.
`pnpm build` runs `scripts/setup-db.ts` first, so **every preview build of
`feat/gestion` writes schema into the live database.**

What follows from that:

- Every schema change in `setup-db.ts` is additive and idempotent:
  `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`,
  `CREATE INDEX IF NOT EXISTS`, `CREATE OR REPLACE FUNCTION`, and seeds with
  `ON CONFLICT DO NOTHING`. It never uses `DROP`, `TRUNCATE`, a type change, or
  an `UPDATE` of existing rows.
- New tables appear in production before the code that uses them is merged.
  The live site ignores them, so that is harmless.
- **Anything you create while testing on the preview (test products, sales,
  clientes) is real data in the production DB.** Test records will be named
  with a `TEST ·` prefix, and A6 ships a cleanup script for them. If you'd
  rather not test this way, set up a Neon branch for Preview, then point
  Preview's `DATABASE_URL` at it in Vercel. That takes about five minutes and
  I'd recommend it before A1. Tell me which you prefer.
- The same applies to Stripe: `STRIPE_SECRET_KEY` is one entry shared by
  preview and production. That's relevant to Session B's "test mode on preview"
  check, but not to this session.

### 0.2 Existing state

| Area | Today | Consequence |
|---|---|---|
| Clientes | No table. `getCustomers()` derives customers from `bookings LEFT JOIN customer_notes ON email`. `customer_notes` has no unique index on email. Measurements are free-form JSONB. | New `clientes` table, plus a manual backfill script. Bookings get a `cliente_id`. |
| Citas | `bookings` (unique `(date,time)`) + `blocked_slots`. **New bookings are inserted by `lib/bookings.ts`, which is public code owned by Session B.** | I can't edit the insert, so a DB trigger links new bookings to clientes (§2.2). |
| Admin users | `admins(id, name, email, role)`. The JWT payload is `{id, email, role}`, and `requireAuth()` returns it. | The movement ledger gets `admin_id` straight from the session. No auth change needed. |
| Roles | `owner` / `manager` exist but nothing checks them. | No permission matrix for now. See question G7. |
| Payments | `payments`, written by the public Stripe route. Amounts are in cents, keyed by email. | Left untouched. A3's combined view joins on email when it reads. |
| Uploads | None. No `BLOB_READ_WRITE_TOKEN` exists in Vercel env. | A1 stops and asks you to create a Blob store (§7). |
| DB access | `lib/db.ts` exposes `query()` and `pool`, but no transaction helper. | Add `withTransaction()` in `lib/admin/` (§4.3). |

### 0.3 Ownership conflicts to resolve before A1

1. **`components/admin/AdminSidebar.tsx` and `AdminShell.tsx` are outside my
   area.** My area is `app/admin/**`, `app/api/admin/**` and `lib/admin/**`. A1
   reorganises the sidebar and A2 adds the stock badge, so I need to edit
   them. Two options:
   - (a) You allow me to edit those two files.
   - (b) I move them into `app/admin/_components/`, keep the old paths as
     one-line re-exports, and delete those in A6.

   I recommend (a).
2. **Public code imports `lib/admin/db.ts`:** `getSettings`, `createContact`,
   `getAllContent`, `getCourses`, `createConfiguration`,
   `updatePaymentBySessionId` and `createPayment`. These exports keep their
   current names and signatures. New gestión code goes in new files
   (`lib/admin/clientes.ts`, `inventario.ts`, …) rather than growing `db.ts`.
3. **Displaying Blob images with `next/image` needs a `remotePatterns` entry
   in `next.config.ts`, which Session B owns.** The admin will render product
   photos with `unoptimized`, or a plain `<img>` with sized thumbnails
   generated at upload, so `next.config.ts` stays untouched.
4. **The `settings` seeds `configurador` and `modelos3d`.** In A1 I'll remove
   them from the seed list, so new databases don't get them, and hide them in
   Ajustes. Existing rows stay.

### 0.4 Conventions

- **Naming.** Gestión tables and columns use Spanish domain words, matching
  Evelyn's vocabulary and the UI. `id`, `created_at` and `updated_at` follow
  the existing tables.
- **Money.** `NUMERIC(12,2)` in euros.
  - PVP is stored **IVA incluido**, as printed on the tag; the base is derived.
    See question G2.
  - The existing `payments.amount` stays in cents (Stripe), and
    `courses.price` stays in integer euros.
- **Quantities.** `NUMERIC(12,3)`, which covers metres of tejido and thread
  bobbins.
- **Times.** `TIMESTAMPTZ` for new tables. Existing tables use `TIMESTAMP`,
  and stay as they are.
- **Archiving.** Nothing that a sale, movement or encargo references is ever
  hard-deleted. Clientes, productos, variantes and proveedores get
  `activo BOOLEAN` and are archived instead.

---

## 1. Entity overview

```
admins ─┬──────────────────────────────────────────────┐ (admin_id on every write)
        │                                              │
clientes ──< cliente_medidas                           │
   │  └──< bookings.cliente_id (Citas)                 │
   │                                                   │
   ├──< ventas ──< venta_lineas >── producto_variantes ┼──< movimientos_stock
   │       └──< devoluciones ──< devolucion_lineas     │        ▲
   │                                                   │        │
   └──< encargos ──< encargo_pruebas (>── bookings)    │        │
            ├──< encargo_pagos                         │        │
            ├──< encargo_materiales >── producto_variantes ─────┘
            └──< encargo_eventos

proveedores ──< productos ──< producto_variantes
     └──< compras ──< compra_lineas >── producto_variantes ──< movimientos_stock
categorias_producto ──< productos
contadores (ticket / encargo / compra numbering)
```

---

## 2. Clientes and Citas

### 2.1 `clientes`

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| nombre | VARCHAR(100) NOT NULL | |
| apellidos | VARCHAR(150) | |
| email | VARCHAR(200) | Nullable, because walk-ins may not give one |
| telefono | VARCHAR(50) | |
| nif | VARCHAR(20) | Optional, for a future legal invoice outside this app |
| direccion, codigo_postal, ciudad, pais | VARCHAR | |
| fecha_nacimiento | DATE | Optional |
| idioma | VARCHAR(5) DEFAULT 'es' | Taken from `bookings.locale` |
| notas | TEXT | Migrated from `customer_notes.notes` |
| origen | VARCHAR(20) NOT NULL DEFAULT 'tienda' | `tienda` · `web` (created by a booking) · `backfill` |
| acepta_comunicaciones | BOOLEAN DEFAULT FALSE | GDPR consent for marketing; it doesn't block service email |
| activo | BOOLEAN DEFAULT TRUE | |
| created_by | INTEGER → admins(id) ON DELETE SET NULL | |
| created_at, updated_at | TIMESTAMPTZ | |

Indexes:

- `UNIQUE (lower(email)) WHERE email IS NOT NULL`. This is the identity key
  for linking bookings and payments.
- trigram GIN on `nombre || ' ' || coalesce(apellidos,'')`, plus btree on
  `telefono`, for the inline search in Ventas.

### 2.2 Linking `bookings` to clientes

- `ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL`
  plus an index on it.
- A `BEFORE INSERT` trigger on `bookings`, `bookings_link_cliente()`, looks
  up a cliente by `lower(email)`. If none exists, it creates one with
  `origen='web'`, then sets `NEW.cliente_id`. New web bookings keep linking
  without anyone touching `lib/bookings.ts`.
  - Installed with `CREATE OR REPLACE FUNCTION` + `CREATE OR REPLACE TRIGGER`,
    which needs PostgreSQL 14 or later. A1 checks `server_version`. On older
    versions it falls back to a `pg_trigger` existence check.
  - Because the database is shared (§0.1), **the trigger goes live on
    production as soon as the first A1 preview builds.** It only adds a link
    and maybe a cliente row, and the backfill is idempotent, so this is safe.
    It does mean web clientes start appearing before the merge.

### 2.3 `cliente_medidas` (measurement history)

A tailor's measurements change over time, and an encargo must keep the set
it was cut from. So measurements are versioned rows, not one JSON blob.

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| cliente_id | INTEGER NOT NULL → clientes ON DELETE CASCADE | |
| tipo_prenda | VARCHAR(30) | `chaqueta` · `pantalon` · `chaleco` · `camisa` · `abrigo` · `general` |
| medidas | JSONB NOT NULL | `{ "pecho": 102, "cintura": 88, … }` in cm. The key list is fixed in code, and free extra keys are allowed |
| observaciones | TEXT | Posture and build: hombro caído, etc. |
| tomada_por | INTEGER → admins ON DELETE SET NULL | |
| tomada_en | DATE NOT NULL DEFAULT CURRENT_DATE | |
| created_at | TIMESTAMPTZ | |

The index is `(cliente_id, tipo_prenda, tomada_en DESC)`. The ficha shows the
latest set for each garment type, with the history behind a toggle.

### 2.4 `scripts/backfill-clientes.ts` (manual, after merge)

This runs with `--dry-run` by default; `--apply` writes. It is idempotent, so
re-running it changes nothing.

1. For every distinct `lower(email)` in `bookings ∪ customer_notes`:
   - Upsert a cliente. The name comes from the latest `customer_notes.name`,
     else the latest booking name; the phone from the latest booking with one;
     `idioma` from the latest booking `locale`. Set `origen='backfill'`.
   - Never overwrite non-empty fields on a cliente that already exists.
2. `UPDATE bookings SET cliente_id = … WHERE cliente_id IS NULL` by email.
3. `customer_notes.notes` goes to `clientes.notas`, appended if both are
   non-empty. Non-empty `customer_notes.measurements` becomes one
   `cliente_medidas` row with `tipo_prenda='general'`.
   - Rows are marked with `observaciones = 'Importado de notas antiguas'`.
     A re-run skips any cliente that already has an imported row.
4. Print counts: clientes created, already existing, bookings linked, notes
   migrated, measurement sets migrated, and emails skipped as invalid.

`customer_notes` itself is left untouched, as a read-only archive.

---

## 3. Proveedores

### `proveedores`

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| nombre | VARCHAR(150) NOT NULL | Trading name |
| razon_social, nif | VARCHAR | |
| persona_contacto, email, telefono, web | VARCHAR | |
| direccion, ciudad, pais | VARCHAR | Many suppliers are in Italy and the UK |
| condiciones | TEXT | Lead time, minimum order, payment terms |
| notas | TEXT | |
| activo | BOOLEAN DEFAULT TRUE | |
| created_at, updated_at | TIMESTAMPTZ | |

The ficha shows contact details, the products it supplies, purchase history
(compras) and total purchased per year.

---

## 4. Inventario

### 4.1 `categorias_producto`

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| nombre | VARCHAR(80) NOT NULL | |
| slug | VARCHAR(80) NOT NULL UNIQUE | |
| tipo | VARCHAR(10) NOT NULL CHECK (tipo IN ('terminado','material')) | **The split.** A new category must pick a side, and its products inherit it |
| unidad_defecto | VARCHAR(10) NOT NULL DEFAULT 'ud' | Prefills new products, e.g. `m` for Tejidos |
| iva_defecto | NUMERIC(5,2) NOT NULL DEFAULT 21 | Prefills new products |
| orden | INTEGER DEFAULT 0 | |
| activo | BOOLEAN DEFAULT TRUE | |

`UNIQUE (nombre, tipo)`.

**Seeds** use `ON CONFLICT (slug) DO NOTHING`:

- **Producto terminado:** tirantes, corbatas, pajaritas, gemelos, pañuelos,
  camisas, zapatos, cinturones, fajines, chalecos, calcetines, botones, otros
  complementos.
- **Material de taller:** tejidos (`m`), forros (`m`), botones de taller
  (`ud`), hilos (`bobina`), entretelas (`m`), cremalleras (`ud`).

"Botones" appears in both of Evelyn's lists. I've modelled this as two
categories, `botones` (sold to clients) and `botones-taller` (used in
garments). See question G1.

### 4.2 `productos` and `producto_variantes`

**Every product has at least one variant, and stock lives only on variants.**
A product with no real variants, such as a single tie, has exactly one variant
with `es_unica = TRUE`, and the UI hides the variant table for it. Zapatos
38–48 are 11 variants of one product. Each variant has its own SKU, stock,
minimum and location. That rule keeps sales, the ledger and reports uniform:
they always point at `variante_id`.

#### `productos` (the ficha)

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| categoria_id | INTEGER NOT NULL → categorias_producto | `tipo` is read through the category |
| nombre | VARCHAR(200) NOT NULL | |
| referencia | VARCHAR(60) | Base reference; `UNIQUE WHERE NOT NULL` |
| marca | VARCHAR(100) | The brand, which can differ from the supplier |
| proveedor_id | INTEGER → proveedores ON DELETE SET NULL | Main supplier |
| descripcion | TEXT | |
| color, material, talla | VARCHAR(80) | Product-level defaults, used when there's only one variant |
| unidad | VARCHAR(10) NOT NULL DEFAULT 'ud' | `ud` · `par` · `m` · `bobina` · `caja` · `juego`; only `m` allows decimals in the UI |
| coste | NUMERIC(12,2) | List and default cost, IVA excluded |
| pvp | NUMERIC(12,2) | Default retail price, **IVA incluido** |
| iva | NUMERIC(5,2) NOT NULL DEFAULT 21 | 21 / 10 / 4 / 0 |
| stock_minimo_defecto | NUMERIC(12,3) DEFAULT 0 | Copied to new variants |
| ubicacion | VARCHAR(100) | Default location |
| foto_url, foto_thumb_url | VARCHAR(500) | Vercel Blob (§7) |
| observaciones | TEXT | |
| activo | BOOLEAN DEFAULT TRUE | |
| created_by, created_at, updated_at | | |

Indexes:

- `(categoria_id)` and `(proveedor_id)`.
- trigram GIN on `nombre`, `referencia` and `marca`. `CREATE EXTENSION IF NOT
  EXISTS pg_trgm` is available on Neon; if it isn't, the code falls back to
  `ILIKE` with no index, which is fine at this catalogue size.

#### `producto_variantes`

| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| producto_id | INTEGER NOT NULL → productos ON DELETE RESTRICT | |
| sku | VARCHAR(80) | Variant reference, e.g. `ZAP-OXF-NEG-42`; `UNIQUE WHERE NOT NULL`. Barcode-ready |
| atributos | JSONB NOT NULL DEFAULT '{}' | `{"talla":"42","color":"negro","tejido":"…"}`, open-ended |
| etiqueta | VARCHAR(150) | Display text, e.g. "42 · negro", generated from the attributes and editable |
| es_unica | BOOLEAN DEFAULT FALSE | |
| pvp, coste | NUMERIC(12,2) | NULL means "use the product's value", so a size 48 can cost more |
| coste_medio | NUMERIC(12,4) | Weighted average cost, maintained by compras (§4.5). Used for valuation |
| **stock_actual** | NUMERIC(12,3) NOT NULL DEFAULT 0 **CHECK (stock_actual >= 0)** | Cached on-hand quantity. Only the ledger function writes it |
| **stock_reservado** | NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_reservado >= 0) | Material reserved for confirmed encargos (§6) |
| stock_minimo | NUMERIC(12,3) NOT NULL DEFAULT 0 | |
| ubicacion | VARCHAR(100) | Overrides the product location |
| foto_url | VARCHAR(500) | Optional, for colour variants |
| orden | INTEGER DEFAULT 0 | Sizes in order: 38, 39 … 48 |
| activo | BOOLEAN DEFAULT TRUE | |
| created_at, updated_at | | |

Indexes: `(producto_id, orden)`, GIN on `atributos`, and a partial index for
alerts: `WHERE activo AND stock_actual <= stock_minimo`.

The UI has a **variant generator** for creating variants. You pick an
attribute and a range ("talla 38–48", or a list "negro, marrón, burdeos"),
and it creates the combinations with SKUs `{referencia}-{valor}`.

**Alert states for each variant:**

- **agotado:** `stock_actual = 0`.
- **bajo:** `0 < stock_actual <= stock_minimo`. For materiales, availability
  is `stock_actual - stock_reservado`.
- **ok:** anything else.

A product's alert level is its worst variant. The sidebar badge counts
variants that are agotado or bajo, among active variants that have a
`stock_minimo > 0` or that have ever moved.

### 4.3 The stock ledger: `movimientos_stock`

This table is append-only and is the single source of truth.
`producto_variantes.stock_actual` is a cache of `SUM(cantidad)` for each
variant.

| column | type | notes |
|---|---|---|
| id | BIGSERIAL PK | |
| variante_id | INTEGER NOT NULL → producto_variantes ON DELETE RESTRICT | |
| tipo | VARCHAR(25) NOT NULL CHECK (…) | See the table below |
| cantidad | NUMERIC(12,3) NOT NULL CHECK (cantidad <> 0) | **Signed**: + in, − out |
| stock_resultante | NUMERIC(12,3) NOT NULL | On-hand after this movement, as shown in the history |
| coste_unitario | NUMERIC(12,4) | Cost at that moment, for valuation and margins |
| motivo | TEXT | Required for `ajuste` |
| admin_id | INTEGER → admins ON DELETE SET NULL | **Who made the change** |
| admin_nombre | VARCHAR(100) | Snapshot, so history stays readable if the user is deleted |
| venta_linea_id | INTEGER → venta_lineas | Set on `venta` |
| devolucion_linea_id | INTEGER → devolucion_lineas | Set on `devolucion_venta` |
| compra_linea_id | INTEGER → compra_lineas | Set on `compra` / `devolucion_proveedor` |
| encargo_material_id | INTEGER → encargo_materiales | Set on `consumo_encargo` / `devolucion_encargo` |
| created_at | TIMESTAMPTZ NOT NULL DEFAULT now() | |

Indexes: `(variante_id, created_at DESC)`, `(tipo, created_at)` and
`(created_at)`, for the history and the Informes date ranges.

A `BEFORE UPDATE OR DELETE` trigger raises an exception. **A movement is
never edited.** A mistake is corrected by a new `ajuste` movement.

| tipo | sign | created by |
|---|---|---|
| `inicial` | + | Opening stock when a product is created, or the first stock count |
| `compra` | + | Receiving a compra from a proveedor |
| `devolucion_proveedor` | − | Sending goods back to a proveedor |
| `venta` | − | Saving a venta line linked to a variant |
| `devolucion_venta` | + | A devolución line with `reponer_stock = true` |
| `ajuste` | ± | A manual adjustment, with a required reason: recuento, rotura, merma, regalo, uso interno, error |
| `consumo_encargo` | − | Material cut for an encargo |
| `devolucion_encargo` | + | Leftover material returned to stock after cutting |

**The only write path** is `aplicarMovimientos(client, movimientos[], admin)`
in `lib/admin/stock.ts`, always called inside `withTransaction()`:

```sql
BEGIN;
-- lock every touched variant, in id order so two sales can't deadlock
SELECT id, stock_actual, stock_reservado, coste_medio
  FROM producto_variantes WHERE id = ANY($ids) ORDER BY id FOR UPDATE;
-- in TypeScript: compute new stock; reject if any goes below 0
--   (error says which variant and how many are available)
INSERT INTO movimientos_stock (…, stock_resultante, …) VALUES …;
UPDATE producto_variantes SET stock_actual = $new, coste_medio = $cm, updated_at = now() WHERE id = $id;
-- plus the business rows (venta, venta_lineas…) in the same transaction
COMMIT;
```

There are three layers against overselling the last unit:

- the row lock serialises concurrent sales;
- the TypeScript check gives a readable error;
- `CHECK (stock_actual >= 0)` is a last line of defence.

If two people sell the last tie at the same moment, one sale is saved. The
other gets "Solo queda 0 ud. de Corbata X" and nothing of it is written.

**Consistency check** (A6 and the Informes page): a query reports any variant
where `stock_actual <> COALESCE(SUM(movimientos.cantidad), 0)`. The result
should always be empty.

### 4.4 Units of measure

- `productos.unidad` sets the unit for the product and all its variants.
- Quantities are `NUMERIC(12,3)` everywhere: ledger, lines, stock and minimum.
- The UI allows decimal input for `m`; other units use whole numbers.
- Price and cost are per unit, e.g. €/m.

Buying in one unit and using in another (a 50 m roll counted in metres) is
handled by buying in metres. There's no automatic conversion between units;
that would be over-engineering for this shop.

### 4.5 Compras (entradas from a proveedor)

| table | columns |
|---|---|
| `compras` | id, numero (`C-2026-0001`), proveedor_id NOT NULL, fecha, referencia_proveedor (their albarán or invoice no.), estado (`borrador` · `recibida` · `anulada`), notas, admin_id, created_at |
| `compra_lineas` | id, compra_id, variante_id NOT NULL, cantidad > 0, coste_unitario (IVA excluded), cantidad_devuelta DEFAULT 0 |

How it behaves:

- A draft compra doesn't touch stock.
- **Recibir** creates one `compra` movement per line. In the same transaction
  it updates `coste_medio = (stock·coste_medio + cantidad·coste_unitario) / (stock + cantidad)`.
- A received compra can't be edited. A return to the proveedor creates
  `devolucion_proveedor` movements and increases `cantidad_devuelta`.

A quick "Entrada rápida" from the product ficha creates a one-line received
compra. Every entrada therefore has a proveedor and a cost.

---

## 5. Ventas (sales register — **not fiscal invoicing**)

Legal invoicing under VeriFactu and the anti-fraud rules (RD 1007/2023) is
out of scope.

- The app records sales and prints a **ticket / albarán non-fiscal**. It
  carries a fixed footer: *"Documento sin validez fiscal. No es una factura."*
- The UI never uses the word "factura" for these documents.
- The shop must keep issuing legal tickets and invoices through its current
  system or gestoría. The sidebar entry is called **"Ventas"**, not
  "Facturación", to avoid suggesting otherwise. See question G6.

| table | columns |
|---|---|
| `ventas` | id, numero (`V-2026-0001`, from `contadores`), fecha TIMESTAMPTZ, cliente_id → clientes NULL (NULL = "venta sin cliente"), admin_id, metodo_pago (`efectivo` · `tarjeta` · `bizum` · `transferencia` · `mixto` · `otro`), pagos JSONB (split payments when mixto), total_base, total_iva, total, descuento_total, estado (`completada` · `devuelta_parcial` · `devuelta` · `anulada`), notas, created_at |
| `venta_lineas` | id, venta_id, variante_id NULL, descripcion (snapshot), cantidad > 0, pvp_unitario (IVA incl, snapshot), descuento_pct, importe_descuento, iva (snapshot), base, cuota_iva, total, coste_unitario (snapshot of coste_medio, for margins), cantidad_devuelta DEFAULT 0 |
| `devoluciones` | id, venta_id, numero (`D-2026-0001`), fecha, admin_id, motivo, importe_total, metodo_reembolso, created_at |
| `devolucion_lineas` | id, devolucion_id, venta_linea_id, cantidad > 0, importe, reponer_stock BOOLEAN DEFAULT TRUE |
| `contadores` | serie VARCHAR(5), anio INTEGER, ultimo INTEGER, PK (serie, anio); incremented with `FOR UPDATE` in the same transaction |

Rules:

- A line with `variante_id NULL` is a **free-text line**, e.g. "Arreglo de bajo
  de pantalón". It is sold without touching stock.
- Saving a venta inserts the venta, its lines and one `venta` movement per
  stock line. It all happens in a single transaction, or nothing does.
- IVA breakdown by rate, per line:
  - `total = cantidad·pvp_unitario − importe_descuento`
  - `base = round(total / (1 + iva/100), 2)`
  - `cuota = total − base`
  - The ticket groups lines by rate. Rounding per line means
    `base + cuota = total` always holds exactly.
- **Devolución:**
  - Lock the `venta_lineas` `FOR UPDATE`.
  - `cantidad ≤ cantidad − cantidad_devuelta`.
  - Create `devolucion_venta` movements only for lines with
    `reponer_stock = true`. A damaged item can be refunded without
    returning to stock.
  - Update `cantidad_devuelta` and the venta's estado.
- **Anular** is only allowed the same day. It is implemented as a full
  devolución, so the ledger stays append-only.
- The ficha del cliente lists ventas and devoluciones.
- The combined "Cobros" view is a `UNION` of ventas and the Stripe `payments`
  table, joined to clientes by `lower(email)` when it reads.

---

## 6. Encargos y Taller — propuesta

This is a proposal based on a standard bespoke workflow. A4 doesn't start
until Evelyn's answers (§6.5) confirm or change it.

### 6.1 The bespoke workflow

1. **Consulta.** Choose the garment, style and tejido; give a quote.
2. **Confirmación.** The client accepts and pays a **señal** (deposit,
   typically 30–50 %). The encargo gets a delivery date, and often an event
   date: a wedding.
3. **Toma de medidas.** May happen at the consulta.
4. **Patrón y corte.** The tejido is cut, so material leaves stock now.
5. **1ª prueba (hilvanes):** a basted fitting. **2ª prueba:** a forward
   fitting. Sometimes there is a 3rd.
6. **Acabado.** Buttonholes, pressing.
7. **Prueba final y entrega.** The remaining balance is paid.

Arreglos (alterations) are a shorter version: recepción → en taller → listo
→ entregado.

### 6.2 Tables

| table | columns |
|---|---|
| `encargos` | id, numero (`E-2026-0001`), cliente_id NOT NULL, tipo (`a_medida` · `arreglo`), tipo_prenda (`traje_2p` · `traje_3p` · `chaqueta` · `pantalon` · `chaleco` · `abrigo` · `chaque` · `smoking` · `frac` · `camisa` · `otro`), descripcion, especificaciones JSONB (solapa, botones, aberturas, bolsillos, forro, iniciales…), medidas_id → cliente_medidas (the set it was cut from), tejido_cliente BOOLEAN (client supplied the cloth), precio NUMERIC(12,2) (IVA incl), estado, sastre_id → admins NULL, fecha_evento DATE, fecha_entrega_prevista DATE, fecha_entrega_real DATE, notas, created_by, created_at, updated_at |
| `encargo_pagos` | id, encargo_id, fecha, tipo (`senal` · `pago` · `reembolso`), importe, metodo_pago, admin_id, notas. Pendiente = precio − Σ pagos, computed |
| `encargo_pruebas` | id, encargo_id, tipo (`medidas` · `prueba_1` · `prueba_2` · `prueba_3` · `final` · `entrega`), fecha_prevista TIMESTAMPTZ, booking_id → bookings NULL (links to Citas), realizada_en, notas_ajustes, admin_id |
| `encargo_materiales` | id, encargo_id, variante_id NOT NULL, cantidad_prevista, cantidad_consumida, estado (`previsto` · `reservado` · `consumido` · `liberado`) |
| `encargo_eventos` | id, encargo_id, de_estado, a_estado, admin_id, nota, created_at (stage history) |

Proposed `estado` values: `presupuesto` → `confirmado` → `corte` →
`prueba_1` → `prueba_2` → `acabado` → `listo` → `entregado`, plus
`cancelado`.

### 6.3 Material and stock

- **On confirmation**, each `encargo_materiales` line moves to `reservado`.
  `stock_reservado += cantidad_prevista`, under the same variant lock. There
  is no ledger movement, because on-hand doesn't change. The available
  figure drops, so the material can't be sold or promised twice.
  - If a confirmation would reserve more than is available, it is allowed
    with a warning: "falta material, pedir al proveedor". The material simply
    goes on order.
- **On corte**, the tailor enters the real quantity.
  - This creates a `consumo_encargo` movement (−real) and releases the
    reservation.
  - If cutting used less than reserved, the difference is just released.
  - Leftover returned to stock later is a `devolucion_encargo`.
- **On cancelación**, reserved lines are released; consumed lines stay
  consumed. The cloth was cut.
- Tejido supplied by the client (`tejido_cliente`) has no material line.

### 6.4 Taller board

This is a kanban: one column per estado, from `confirmado` to `listo`. Each
card shows:

- cliente and prenda;
- the assigned tailor, as a coloured initial;
- the next prueba date;
- the delivery or event date, flagged red if within 7 days or overdue.

The board can be filtered by sastre and prenda. Moving a card is a button,
"Siguiente fase →", not drag-and-drop, so it works reliably on an iPad. The
button logs `encargo_eventos`, and on entering `corte` it asks for the real
material quantities.

Tailors who don't log in can be represented as `admins` rows with
`role='sastre'` and no password (see question E6).

### 6.5 Preguntas para Evelyn

**Encargos y taller**

- **E1.** ¿Qué fases sigue realmente un traje a medida desde que el cliente
  dice "sí" hasta la entrega? ¿Cuántas pruebas hacéis normalmente (una, dos,
  tres)? ¿Os sirven las fases propuestas: presupuesto, confirmado, corte,
  1ª prueba, 2ª prueba, acabado, listo, entregado?
- **E2.** ¿Cobráis siempre una señal? ¿Es un porcentaje fijo (30 %, 50 %) o
  depende del encargo? ¿El resto se cobra todo en la entrega o puede haber
  pagos intermedios?
- **E3.** ¿Cuándo debe descontarse el tejido del inventario: al confirmar el
  encargo, al cortar o al entregar? ¿Os interesa "reservar" el tejido para un
  encargo para que no se venda ni se use en otro?
- **E4.** Cuando se corta, ¿anotáis los metros reales usados? ¿Los retales
  sobrantes vuelven al stock o se dan por consumidos?
- **E5.** ¿Qué otros materiales queréis descontar por encargo (forro,
  entretela, botones, hilos…) o solo el tejido principal? Para hilos y
  entretelas, ¿preferís descontarlos por encargo o con un ajuste mensual?
- **E6.** ¿Quién trabaja en el taller y a quién se le asigna cada encargo?
  ¿Los sastres van a entrar en la aplicación con su propio usuario, o solo
  Evelyn y Manuel la manejan y asignan?
- **E7.** ¿Los arreglos se gestionan como encargos (con cliente, precio y
  fecha) o van aparte? ¿Y las camisas a medida?
- **E8.** ¿El cliente a veces trae su propio tejido? ¿Hacéis trabajos que se
  confeccionan fuera (un taller externo o el camisero), y queréis seguirlos
  aquí?
- **E9.** ¿Qué detalles de la prenda anotáis siempre en la hoja de encargo
  (solapa, botones, aberturas, bolsillos, forro, iniciales…)? Si tenéis una
  hoja de encargo en papel, ¿nos podéis enviar una foto?
- **E10.** ¿Qué medidas tomáis para cada prenda? ¿Nos podéis pasar la lista
  (o la ficha de medidas) para que la aplicación tenga los mismos campos?
- **E11.** ¿Las pruebas se citan como las citas normales del calendario? ¿Os
  vendría bien que al crear una prueba se reserve el hueco en Citas?

**Generales (inventario y ventas)**

- **G1.** "Botones" aparece tanto en productos terminados como en materiales
  de taller. ¿Son los mismos botones (una sola categoría) o distintos: unos
  que se venden sueltos y otros que se usan en las prendas?
- **G2.** ¿El PVP que ponéis en las etiquetas es con IVA incluido? ¿Todos los
  productos llevan el 21 %?
- **G3.** Si se intenta vender algo que según el sistema no tiene stock,
  ¿preferís que la aplicación lo bloquee (y primero se haga un ajuste) o que
  deje vender y avise?
- **G4.** ¿Qué formas de pago aceptáis en tienda (efectivo, tarjeta, Bizum,
  transferencia…)? ¿A veces un cliente paga una parte con cada forma?
- **G5.** ¿Cuál es vuestra política de devoluciones (plazo, reembolso o vale)?
  ¿Hacéis vales o cambios por otra talla?
- **G6.** Las facturas y tickets oficiales, ¿los seguís haciendo con vuestro
  programa o gestoría actual? Esta aplicación registrará las ventas e
  imprimirá un ticket o albarán sin validez fiscal; no sustituye al sistema de
  facturación.
- **G7.** ¿Todos los usuarios deben ver costes y márgenes, o solo los
  propietarios?
- **G8.** ¿Dónde se guarda el género (tienda, taller, almacén…)? ¿Nos dais la
  lista de ubicaciones para elegirla de un desplegable?
- **G9.** ¿Usáis o queréis usar códigos de barras en las etiquetas?
- **G10.** Para empezar, ¿cómo vamos a meter el stock actual: lo vais
  introduciendo vosotros producto a producto, o tenéis un Excel que podamos
  importar?

---

## 7. Product photos: Vercel Blob

- **Storage.** A **public** Vercel Blob store. Product photos aren't
  sensitive, and public URLs render directly.
- **Upload path.**
  - A client upload goes through `/api/admin/uploads`, which issues a token
    through `@vercel/blob/client` `handleUpload` and requires an admin
    session. This avoids the 4.5 MB function body limit for iPad camera
    photos.
  - The browser downscales to about 1600 px and makes a 400 px thumbnail
    before uploading.
  - Paths are `productos/{id}/{random}.jpg`.
  - When a photo is replaced, the old blob is deleted.
- **Display.** `unoptimized`, or a plain `<img>`, in admin, so
  `next.config.ts` (Session B) stays untouched.
- **Dependency.** `@vercel/blob`, added with `pnpm add`. This touches
  `package.json` and `pnpm-lock.yaml`, which Session B also edits. Per the
  merge plan, B merges first; I then rebase and re-run `pnpm install`.
- **What you need to create** (A1 stops for this): Vercel → project
  `sastreria-manuel-fernandez` → Storage → Create → Blob → name
  `smf-gestion-fotos`, access **Public**, then connect it to Production and
  Preview. That adds `BLOB_READ_WRITE_TOKEN` to both. I can do this through
  the Vercel CLI if you prefer; say so.

---

## 8. Informes (A5): queries on this model

- **Stock actual:** variants joined to products and categories, grouped by
  category and tipo, with quantity, valued at coste_medio and at PVP.
- **Movimientos:** `movimientos_stock` in a date range, filterable by tipo,
  category, product or user.
- **Ventas:** by period, product, category or cliente, with base, IVA, total
  and margin (`total − cantidad·coste_unitario`), net of devoluciones.
- **Valoración:**
  - at cost: `Σ stock_actual · coste_medio`;
  - at PVP: `Σ stock_actual · pvp` (IVA incl) and base.
- **Stock bajo / agotado:** the alert list.

Every report is a server-side query with a CSV export (UTF-8 with BOM and a
`;` separator, so Excel in Spain opens it correctly).

---

## 9. What `setup-db.ts` gains, phase by phase

| Phase | Added (all `IF NOT EXISTS` / `OR REPLACE` / `ON CONFLICT DO NOTHING`) |
|---|---|
| A1 | `clientes`, `cliente_medidas`, `bookings.cliente_id` + index, `bookings_link_cliente` trigger, `proveedores`, `pg_trgm` |
| A2 | `categorias_producto` + seeds, `productos`, `producto_variantes`, `compras`, `compra_lineas`, `movimientos_stock` + append-only trigger, `contadores` |
| A3 | `ventas`, `venta_lineas`, `devoluciones`, `devolucion_lineas` (FKs from `movimientos_stock` added with `ADD CONSTRAINT` guarded by a `pg_constraint` check) |
| A4 | `encargos`, `encargo_pagos`, `encargo_pruebas`, `encargo_materiales`, `encargo_eventos` |

Tables are created in dependency order. The forward FKs on
`movimientos_stock` (to venta, devolución and encargo lines) are added in the
phase whose table they point to. Existing tables gain only nullable columns.
