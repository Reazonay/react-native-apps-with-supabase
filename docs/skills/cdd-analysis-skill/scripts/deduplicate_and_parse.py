#!/usr/bin/env python3
"""
CDD Analysis Skill – Pre-Processing Script
==========================================
Zweck:
  1. ID-Injektion:   Fügt jedem sichtbaren HTML-Knoten ein eindeutiges
                     data-cdd-id-Attribut hinzu (z. B. cdd-id="atm-btn-01").
  2. Deduplizierung: Scannt alle HTML-Dateien und filtert exakte Duplikate
                     heraus (Content-Hashing). Duplikate werden referenziert.
  3. JSON-Output:    Erzeugt eine strukturierte JSON-Datei für den Agent.

Verwendung:
  python deduplicate_and_parse.py \\
    --input  docs/workflow/snapshots/ \\
    --output docs/skills/cdd-analysis-skill/references/deduplicated-components.json

Abhängigkeiten (nur stdlib):
  Python >= 3.8, html.parser, hashlib, json, argparse, pathlib
"""

import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Konfiguration: Welche HTML-Elemente / CSS-Klassen gelten als "sichtbar"
# ---------------------------------------------------------------------------
VISIBLE_TAGS = {
    "nav", "header", "main", "section", "article", "aside", "footer",
    "div", "span", "h1", "h2", "h3", "h4", "p", "a", "button",
    "input", "textarea", "select", "label", "ul", "ol", "li",
}

# Tags, die wir grundsätzlich ignorieren (nicht sichtbar / strukturlos)
SKIP_TAGS = {"html", "head", "body", "meta", "link", "script", "style", "title"}

# CSS-Klassen → Atomic-Level + Component-Hint
CLASSIFICATION_HINTS = {
    "nav-button":     {"level_hint": "atom",     "component_hint": "NavButton"},
    "heading":        {"level_hint": "atom",     "component_hint": "Heading"},
    "subheading":     {"level_hint": "atom",     "component_hint": "BodyText"},
    "meta":           {"level_hint": "atom",     "component_hint": "BodyText"},
    "label":          {"level_hint": "atom",     "component_hint": "LabelCaps"},
    "badge":          {"level_hint": "atom",     "component_hint": "Badge"},
    "status-pill":    {"level_hint": "atom",     "component_hint": "StatusPill"},
    "health-button":  {"level_hint": "atom",     "component_hint": "ActionButton"},
    "endpoint":       {"level_hint": "atom",     "component_hint": "BodyText"},
    "health-message": {"level_hint": "atom",     "component_hint": "BodyText"},
    "card-header":    {"level_hint": "molecule", "component_hint": "WorkoutCardHeader"},
    "nav-row":        {"level_hint": "molecule", "component_hint": "NavigationPillGroup"},
    "status-row":     {"level_hint": "molecule", "component_hint": "HealthStatusRow"},
    "card":           {"level_hint": "organism", "component_hint": "Card"},
    "list":           {"level_hint": "organism", "component_hint": "WorkoutList"},
    "grid":           {"level_hint": "organism", "component_hint": "AdminWorkoutGrid"},
    "page":           {"level_hint": "template", "component_hint": "PageTemplate"},
}

# HTML-Tag → CDD-Prefix
TAG_PREFIX_MAP = {
    "h1": "atm", "h2": "atm", "h3": "atm",
    "p": "atm", "span": "atm", "button": "atm",
    "label": "atm", "input": "atm",
    "nav": "mol", "ul": "mol", "ol": "mol",
    "section": "org", "article": "org",
    "main": "tpl", "header": "tpl", "footer": "tpl",
    "div": "atm",  # div wird später nach CSS-Klasse überschrieben
}

LEVEL_PREFIX = {
    "atom":     "atm",
    "molecule": "mol",
    "organism": "org",
    "template": "tpl",
    "page":     "pge",
}


# ---------------------------------------------------------------------------
# HTML-Parser
# ---------------------------------------------------------------------------
class CDDHTMLParser(HTMLParser):
    """Parst eine HTML-Datei und sammelt alle sichtbaren Elemente."""

    def __init__(self, source_file: str):
        super().__init__()
        self.source_file = source_file
        self.elements: list[dict] = []
        self._stack: list[dict] = []   # Element-Stack für Eltern-Tracking
        self._counters: dict[str, int] = {}  # Zähler pro CDD-Prefix

    # ---- interne Hilfsmethoden -------------------------------------------

    def _get_attrs(self, attrs: list[tuple]) -> dict:
        return {k: v for k, v in attrs if k is not None}

    def _get_classes(self, attrs: dict) -> list[str]:
        return attrs.get("class", "").split()

    def _resolve_hint(self, tag: str, classes: list[str]) -> dict:
        """Bestimmt Level- und Komponenten-Hint anhand Klassen oder Tag."""
        for cls in classes:
            if cls in CLASSIFICATION_HINTS:
                return CLASSIFICATION_HINTS[cls]
        # Fallback: Heading-Tags
        if tag in ("h1", "h2", "h3"):
            return {"level_hint": "atom", "component_hint": "Heading"}
        return {"level_hint": "atom", "component_hint": "Unknown"}

    def _next_cdd_id(self, level_hint: str, component_hint: str) -> str:
        """Erzeugt eine eindeutige CDD-ID, z. B. atm-badge-03."""
        prefix = LEVEL_PREFIX.get(level_hint, "atm")
        # Kurzname aus component_hint ableiten
        short = re.sub(r'(?<!^)(?=[A-Z])', '-', component_hint).lower()
        short = short[:10]  # Maximallänge begrenzen
        key = f"{prefix}-{short}"
        self._counters[key] = self._counters.get(key, 0) + 1
        return f"{key}-{self._counters[key]:02d}"

    def _content_hash(self, tag: str, attrs: dict, classes: list[str]) -> str:
        """Erzeugt einen stabilen Hash aus Tag + Klassen (ohne dynamische Inhalte)."""
        canonical = f"{tag}|{','.join(sorted(classes))}"
        return hashlib.sha256(canonical.encode()).hexdigest()[:12]

    # ---- HTMLParser Hooks ------------------------------------------------

    def handle_starttag(self, tag: str, attrs: list[tuple]):
        if tag in SKIP_TAGS or tag not in VISIBLE_TAGS:
            self._stack.append(None)
            return

        attr_dict = self._get_attrs(attrs)
        classes = self._get_classes(attr_dict)
        hint = self._resolve_hint(tag, classes)
        cdd_id = self._next_cdd_id(hint["level_hint"], hint["component_hint"])
        content_hash = self._content_hash(tag, attr_dict, classes)

        parent_id = None
        for frame in reversed(self._stack):
            if frame is not None:
                parent_id = frame["cdd-id"]
                break

        element = {
            "cdd-id":         cdd_id,
            "tag":            tag,
            "classes":        classes,
            "level_hint":     hint["level_hint"],
            "component_hint": hint["component_hint"],
            "content_hash":   content_hash,
            "source_file":    self.source_file,
            "parent_cdd_id":  parent_id,
            "duplicate_of":   None,   # wird in Phase 2 gesetzt
            "attrs":          {k: v for k, v in attr_dict.items() if k != "class"},
        }
        self._stack.append(element)
        self.elements.append(element)

    def handle_endtag(self, tag: str):
        if self._stack:
            self._stack.pop()

    def handle_data(self, data: str):
        text = data.strip()
        if text and self._stack:
            top = self._stack[-1]
            if top is not None and "text_content" not in top:
                top["text_content"] = text


# ---------------------------------------------------------------------------
# Phase 2: Deduplizierung über alle Dateien
# ---------------------------------------------------------------------------
def deduplicate(elements: list[dict]) -> list[dict]:
    """
    Markiert exakte Duplikate via content_hash.
    Das erste Vorkommen bleibt canonical, alle weiteren erhalten duplicate_of.
    """
    seen_hashes: dict[str, str] = {}  # hash → cdd-id des Originals

    for elem in elements:
        h = elem["content_hash"]
        if h in seen_hashes:
            elem["duplicate_of"] = seen_hashes[h]
        else:
            seen_hashes[h] = elem["cdd-id"]

    return elements


# ---------------------------------------------------------------------------
# Phase 3: ID in HTML injizieren und verarbeitete Datei speichern
# ---------------------------------------------------------------------------
def inject_ids_into_html(source_path: Path, elements: list[dict], output_dir: Path) -> Path:
    """
    Liest die Original-HTML-Datei und schreibt eine neue Datei mit
    data-cdd-id-Attributen in jeden gefundenen sichtbaren Tag.
    """
    html = source_path.read_text(encoding="utf-8")

    # Lookup: (tag, frozenset(classes)) → cdd-id (nur canonicals)
    id_map: dict[tuple, str] = {}
    for elem in elements:
        if elem["source_file"] == source_path.name and elem["duplicate_of"] is None:
            key = (elem["tag"], frozenset(elem["classes"]))
            if key not in id_map:
                id_map[key] = elem["cdd-id"]

    def replace_tag(match):
        full = match.group(0)
        tag_name_match = re.match(r'<(\w+)', full)
        if not tag_name_match:
            return full
        tag = tag_name_match.group(1).lower()
        if tag in SKIP_TAGS or tag not in VISIBLE_TAGS:
            return full

        # Klassen extrahieren
        cls_match = re.search(r'class="([^"]*)"', full)
        classes = cls_match.group(1).split() if cls_match else []
        key = (tag, frozenset(classes))

        cdd_id = id_map.get(key)
        if not cdd_id:
            # Duplikat → Original-ID nachschlagen
            for elem in elements:
                if elem["source_file"] == source_path.name:
                    if elem["tag"] == tag and set(elem["classes"]) == set(classes):
                        cdd_id = elem.get("duplicate_of") or elem["cdd-id"]
                        break

        if cdd_id and 'data-cdd-id' not in full:
            # ID direkt nach dem Tag-Namen einfügen
            return full.replace(f'<{tag}', f'<{tag} data-cdd-id="{cdd_id}"', 1)
        return full

    injected = re.sub(r'<[a-zA-Z][^>]*>', replace_tag, html)

    output_dir.mkdir(parents=True, exist_ok=True)
    out_path = output_dir / source_path.name
    out_path.write_text(injected, encoding="utf-8")
    return out_path


# ---------------------------------------------------------------------------
# Hauptfunktion
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="CDD Pre-Processing: ID-Injektion, Deduplizierung, JSON-Output"
    )
    parser.add_argument("--input",  "-i", required=True,
                        help="Ordner mit HTML-Snapshot-Dateien")
    parser.add_argument("--output", "-o", required=True,
                        help="Pfad für die JSON-Ausgabedatei")
    parser.add_argument("--inject-dir", "-d", default=None,
                        help="Ordner für injizierte HTML-Dateien (optional)")
    args = parser.parse_args()

    input_path  = Path(args.input)
    output_path = Path(args.output)
    inject_dir  = Path(args.inject_dir) if args.inject_dir else None

    if not input_path.exists():
        print(f"[ERROR] Input-Ordner nicht gefunden: {input_path}")
        raise SystemExit(1)

    html_files = sorted(input_path.glob("*.html"))
    if not html_files:
        print(f"[ERROR] Keine .html-Dateien in {input_path}")
        raise SystemExit(1)

    print(f"[INFO] Verarbeite {len(html_files)} HTML-Datei(en)...")

    all_elements: list[dict] = []
    file_hashes: dict[str, str] = {}

    # Phase 1: Parsen aller Dateien
    for html_file in html_files:
        raw = html_file.read_text(encoding="utf-8")
        file_hash = hashlib.sha256(raw.encode()).hexdigest()[:16]
        file_hashes[html_file.name] = file_hash

        p = CDDHTMLParser(source_file=html_file.name)
        p.feed(raw)
        all_elements.extend(p.elements)
        print(f"  ✓ {html_file.name}: {len(p.elements)} Elemente gefunden")

    # Phase 2: Deduplizierung
    all_elements = deduplicate(all_elements)
    canonical_count  = sum(1 for e in all_elements if e["duplicate_of"] is None)
    duplicate_count  = sum(1 for e in all_elements if e["duplicate_of"] is not None)
    print(f"[INFO] Canonicals: {canonical_count} | Duplikate: {duplicate_count}")

    # Phase 3: ID-Injektion in HTML (optional)
    processed_files = []
    if inject_dir:
        for html_file in html_files:
            file_elements = [e for e in all_elements if e["source_file"] == html_file.name]
            out = inject_ids_into_html(html_file, file_elements, inject_dir)
            processed_files.append(str(out))
            print(f"  ✓ Injiziert: {out}")
    else:
        processed_files = [str(f) for f in html_files]

    # JSON-Output zusammenbauen
    output_data = {
        "metadata": {
            "generated_on": datetime.now(timezone.utc).isoformat(),
            "script_version": "1.0.0",
            "source_dir": str(input_path),
            "total_elements": len(all_elements),
            "canonical_elements": canonical_count,
            "duplicate_elements": duplicate_count,
        },
        "processed_files": [
            {"file": name, "hash": h}
            for name, h in file_hashes.items()
        ],
        "elements": all_elements,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(output_data, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"[OK] JSON-Output geschrieben: {output_path}")


if __name__ == "__main__":
    main()
