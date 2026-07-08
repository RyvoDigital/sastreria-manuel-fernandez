#!/usr/bin/env python3
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCX = ROOT / "raw/WEB LISTA.docx"
OUT_IMG = ROOT / "raw/web_lista_images"
OUT_IMG.mkdir(parents=True, exist_ok=True)

LABEL_MAP = [
    (r"EN VISUAL|HOME.?VISUAL|\bVISUAL\b", "home-visual"),
    (r"OR[IÍ]GEN|ORIGIN", "home-origin"),
    (r"PROCESO|THE.?PROCESS|GRADING", "home-the-process"),
    (r"SELECCI[OÓ]N|SELECTION", "home-selection"),
    (r"INTERPRETACI[OÓ]N|SARTORIAL", "home-sartorial-interpretation"),
    (r"RESULTADO|THE.?RESULT", "home-the-result"),
    (r"BODAS.*LINING|FORRO|LINING", "bodas-lining"),
    (r"BODAS.*MORNING|MORNING.?COAT.*BODAS", "bodas-morning-coat"),
    (r"BODAS.*SUIT|TRAJE.*BODA", "bodas-suit"),
    (r"BODAS.*HERO", "bodas-hero"),
    (r"BODAS.*BUTTON", "bodas-buttons"),
    (r"BODAS.*CEREM", "bodas-ceremony"),
    (r"BODAS.*FABRIC", "bodas-fabrics"),
    (r"BODAS.*STROLLER", "bodas-stroller"),
    (r"CONFIGURADOR", "configurador-overview"),
    (r"CREATE YOUR SUIT|CREA TU TRAJE", "create-your-suit"),
    (r"CURSOS", "cursos-overview"),
    (r"CONTACTO.*PAGE|PAGINA.*CONTACTO", "contacto-page"),
    (r"CONTACTO.*SECTION|SECCI[OÓ]N.*CONTACTO", "contacto-section"),
    (r"SERVICIOS.*HERO|HERO.*SERVICIOS", "servicios-hero"),
    (r"SERVICIOS.*OVERVIEW|OVERVIEW.*SERVICIOS", "servicios-overview"),
    (r"VIDEOLLAMADA|VIDEO.?LLAMADA", "videollamada-overview"),
    (r"PRODUCTO.*ARTISAN.?COAT|ARTISAN.?COAT", "producto-artisan-coat"),
    (r"PRODUCTO.*ARTISAN.?SUIT|ARTISAN.?SUIT", "producto-artisan-suit"),
    (r"PRODUCTO.*BLAZER|\bBLAZER\b", "producto-blazer"),
    (r"PRODUCTO.*MORNING|MORNING.?COAT", "producto-morning-coat"),
    (r"PRODUCTO.*SHIRT|CAMISA", "producto-shirts"),
    (r"PRODUCTO.*STROLLER|STROLLER", "producto-stroller"),
    (r"PRODUCTO.*TUXEDO|SMOKING", "producto-tuxedo"),
    (r"SASTRER[IÍ]A.*HERO|HERO.*SASTRER", "sastreria-hero"),
    (r"MANUEL", "sastreria-manuel-fernandez"),
    (r"EVELYN", "sastreria-evelyn-fernandez"),
    (r"OVERVIEW.*SASTRER|SASTRER.*OVERVIEW", "sastreria-overview"),
    (r"CUT BY HAND|CORTE.*MANO", "sastreria-cut-by-hand"),
    (r"ARTISAN.?DETAIL|DETALLE", "sastreria-artisan-detail"),
    (r"NEXT.?STEP|SIGUIENTE", "sastreria-next-step"),
    (r"SPACE.?01|ESPACIO.?01", "sastreria-space-01"),
    (r"SPACE.?02|ESPACIO.?02", "sastreria-space-02"),
    (r"SPACE.?03|ESPACIO.?03", "sastreria-space-03"),
]

# Known mapping from prior manual audit (image file -> slug)
KNOWN_MEDIA = {
    "image1.png": "home-the-result",
    "image2.jpg": "cursos-overview",
    "image3.png": "producto-blazer",
    "image4.jpg": "servicios-overview",
    "image5.png": "bodas-lining",
    "image6.png": "producto-artisan-coat",
    "image7.png": "bodas-morning-coat",
    "image8.png": "home-sartorial-interpretation",
    "image9.png": "sastreria-space-01",
    "image10.png": "configurador-overview",
    "image11.png": "producto-artisan-suit",
    "image12.png": "producto-tuxedo",
    "image13.png": "bodas-ceremony",
    "image14.jpg": "create-your-suit",
    "image15.png": "bodas-stroller",
    "image16.png": "contacto-section",
    "image17.png": "sastreria-hero",
    "image18.png": "servicios-hero",
    "image19.png": "sastreria-overview",
    "image20.png": "sastreria-artisan-detail",
    "image21.png": "producto-morning-coat",
    "image22.png": "sastreria-cut-by-hand",
    "image23.png": "home-selection",
    "image24.png": "bodas-hero",
    "image25.png": "producto-stroller",
    "image26.png": "sastreria-manuel-fernandez",
    "image27.png": "bodas-suit",
    "image28.png": "home-origin",
    "image29.png": "videollamada-overview",
    "image30.png": "sastreria-space-02",
    "image31.png": "home-visual",
    "image32.png": "home-the-process",
    "image33.png": "bodas-fabrics",
    "image34.png": "contacto-page",
    "image35.png": "sastreria-evelyn-fernandez",
    "image36.png": "sastreria-next-step",
    "image37.png": "producto-shirts",
    "image38.png": "bodas-buttons",
    "image39.png": "sastreria-space-03",
}


def text_of(el):
    parts = []
    for t in el.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"):
        if t.text:
            parts.append(t.text)
        if t.tail:
            parts.append(t.tail)
    return re.sub(r"\s+", " ", "".join(parts)).strip()


def match_label(txt):
    up = txt.upper()
    for pat, slug in LABEL_MAP:
        if re.search(pat, up, re.I):
            return slug
    return None


def main():
    with zipfile.ZipFile(DOCX) as z:
        xml = z.read("word/document.xml")
        rels = z.read("word/_rels/document.xml.rels")
        media_files = {n: z.read(n) for n in z.namelist() if n.startswith("word/media/")}

    root = ET.fromstring(xml)
    rels_root = ET.fromstring(rels)
    rid_to_media = {}
    for rel in rels_root:
        if "Relationship" in rel.tag:
            tgt = rel.attrib.get("Target", "")
            if tgt.startswith("media/"):
                rid_to_media[rel.attrib["Id"]] = "word/" + tgt

    items = []
    current_label = None
    for child in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
        t = text_of(child)
        if t:
            slug = match_label(t)
            if slug:
                current_label = slug
        for blip in child.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}blip"):
            rid = blip.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed")
            media = rid_to_media.get(rid)
            if media:
                items.append({"label": current_label, "text": t, "media": media})

    seen = {}
    for it in items:
        m = it["media"]
        if m not in seen or (it["label"] and not seen[m]["label"]):
            seen[m] = it

    files = []
    for media_path, it in sorted(seen.items(), key=lambda x: x[0]):
        base = Path(media_path).name
        # Use verified 1:1 media map; XML labels are unreliable in this docx.
        slug = KNOWN_MEDIA.get(base) or it["label"] or Path(base).stem
        ext = Path(media_path).suffix.lower()
        dest = OUT_IMG / f"{slug}{ext}"
        dest.write_bytes(media_files[media_path])
        files.append(
            {
                "web_lista": slug,
                "docx_media": media_path,
                "docx_text": it["text"],
                "localFile": str(dest.relative_to(ROOT)),
            }
        )

    out = {"source": str(DOCX.relative_to(ROOT)), "count": len(files), "files": files}
    out_path = ROOT / "WEB_LISTA_DOCX_EXTRACT.json"
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Extracted {len(files)} images → {OUT_IMG.relative_to(ROOT)}/")
    print(f"Manifest → {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()