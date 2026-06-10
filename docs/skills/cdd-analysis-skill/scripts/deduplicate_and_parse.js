#!/usr/bin/env node
/**
 * CDD Analysis Skill – Pre-Processing Script (Node.js)
 * =====================================================
 * 1. ID-Injektion: Fügt jedem sichtbaren HTML-Knoten data-cdd-id hinzu
 * 2. Deduplizierung: Content-Hashing über alle HTML-Dateien
 * 3. JSON-Output: Strukturierte Ausgabe für den Agent
 *
 * Verwendung:
 *   node deduplicate_and_parse.js \
 *     --input  docs/workflow/snapshots/ \
 *     --output docs/skills/cdd-analysis-skill/references/deduplicated-components.json \
 *     --inject-dir docs/workflow/snapshots-processed/
 */

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Konfiguration
// ---------------------------------------------------------------------------
const VISIBLE_TAGS = new Set([
  'nav','header','main','section','article','aside','footer',
  'div','span','h1','h2','h3','h4','p','a','button',
  'input','textarea','select','label','ul','ol','li',
]);

const SKIP_TAGS = new Set([
  'html','head','body','meta','link','script','style','title','!doctype',
]);

const CLASSIFICATION_HINTS = {
  'nav-button':     { level_hint: 'atom',     component_hint: 'NavButton' },
  'heading':        { level_hint: 'atom',     component_hint: 'Heading' },
  'subheading':     { level_hint: 'atom',     component_hint: 'BodyText' },
  'meta':           { level_hint: 'atom',     component_hint: 'BodyText' },
  'label':          { level_hint: 'atom',     component_hint: 'LabelCaps' },
  'badge':          { level_hint: 'atom',     component_hint: 'Badge' },
  'status-pill':    { level_hint: 'atom',     component_hint: 'StatusPill' },
  'health-button':  { level_hint: 'atom',     component_hint: 'ActionButton' },
  'endpoint':       { level_hint: 'atom',     component_hint: 'BodyText' },
  'health-message': { level_hint: 'atom',     component_hint: 'BodyText' },
  'card-header':    { level_hint: 'molecule', component_hint: 'WorkoutCardHeader' },
  'nav-row':        { level_hint: 'molecule', component_hint: 'NavigationPillGroup' },
  'status-row':     { level_hint: 'molecule', component_hint: 'HealthStatusRow' },
  'card':           { level_hint: 'organism', component_hint: 'Card' },
  'list':           { level_hint: 'organism', component_hint: 'WorkoutList' },
  'grid':           { level_hint: 'organism', component_hint: 'AdminWorkoutGrid' },
  'page':           { level_hint: 'template', component_hint: 'PageTemplate' },
};

const LEVEL_PREFIX = {
  atom:     'atm',
  molecule: 'mol',
  organism: 'org',
  template: 'tpl',
  page:     'pge',
};

// ---------------------------------------------------------------------------
// Minimal HTML-Tokenizer (kein externer Parser nötig)
// ---------------------------------------------------------------------------
function tokenizeHTML(html) {
  const tokens = [];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][^\s>/]*)([^>]*)\/?>|([^<]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const full = m[0];
    if (full.startsWith('<!--')) continue;
    if (full.startsWith('</')) {
      tokens.push({ type: 'close', tag: m[1].toLowerCase() });
    } else if (full.startsWith('<')) {
      const tag = m[1].toLowerCase();
      const attrStr = m[2] || '';
      const attrs = parseAttrs(attrStr);
      const selfClose = full.endsWith('/>') || ['meta','link','br','hr','input','img'].includes(tag);
      tokens.push({ type: 'open', tag, attrs, selfClose, raw: full });
    } else {
      const text = full.trim();
      if (text) tokens.push({ type: 'text', text });
    }
  }
  return tokens;
}

function parseAttrs(attrStr) {
  const attrs = {};
  const re = /([a-zA-Z_:\-][^\s=]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

// ---------------------------------------------------------------------------
// Element-Parser
// ---------------------------------------------------------------------------
function parseElements(html, sourceFile) {
  const tokens = tokenizeHTML(html);
  const elements = [];
  const stack = [];       // Stack von Element-Objekten
  const counters = {};    // { "atm-NavButton": 2, ... }

  function getHint(tag, classes) {
    for (const cls of classes) {
      if (CLASSIFICATION_HINTS[cls]) return CLASSIFICATION_HINTS[cls];
    }
    if (['h1','h2','h3','h4'].includes(tag)) return { level_hint: 'atom', component_hint: 'Heading' };
    return { level_hint: 'atom', component_hint: 'Unknown' };
  }

  function nextCddId(level_hint, component_hint) {
    const prefix = LEVEL_PREFIX[level_hint] || 'atm';
    // camelCase → kebab
    const short = component_hint.replace(/([A-Z])/g, (_, c, i) => (i ? '-' : '') + c.toLowerCase()).slice(0, 12);
    const key = `${prefix}-${short}`;
    counters[key] = (counters[key] || 0) + 1;
    return `${key}-${String(counters[key]).padStart(2, '0')}`;
  }

  function contentHash(tag, classes) {
    return crypto.createHash('sha256')
      .update(`${tag}|${[...classes].sort().join(',')}`)
      .digest('hex').slice(0, 12);
  }

  for (const tok of tokens) {
    if (tok.type === 'close') {
      // Pop bis passender tag
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] && stack[i].tag === tok.tag) {
          stack.splice(i, 1);
          break;
        }
      }
      continue;
    }

    if (tok.type === 'text') {
      // Text dem obersten Element geben
      const top = stack[stack.length - 1];
      if (top && !top.text_content) top.text_content = tok.text;
      continue;
    }

    // type === 'open'
    const { tag, attrs, selfClose } = tok;
    if (SKIP_TAGS.has(tag) || !VISIBLE_TAGS.has(tag)) {
      if (!selfClose) stack.push(null);
      continue;
    }

    const classes = (attrs['class'] || '').split(/\s+/).filter(Boolean);
    const hint = getHint(tag, classes);
    const cdd_id = nextCddId(hint.level_hint, hint.component_hint);
    const content_hash = contentHash(tag, classes);

    // Eltern-ID: letztes nicht-null Element im Stack
    let parent_cdd_id = null;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i] !== null) { parent_cdd_id = stack[i]['cdd-id']; break; }
    }

    const { class: _, ...otherAttrs } = attrs;
    const element = {
      'cdd-id':         cdd_id,
      tag,
      classes,
      level_hint:       hint.level_hint,
      component_hint:   hint.component_hint,
      content_hash,
      source_file:      sourceFile,
      parent_cdd_id,
      duplicate_of:     null,
      text_content:     null,
      attrs:            otherAttrs,
    };

    elements.push(element);
    if (!selfClose) stack.push(element);
  }

  return elements;
}

// ---------------------------------------------------------------------------
// Deduplizierung
// ---------------------------------------------------------------------------
function deduplicate(elements) {
  const seen = {}; // hash → cdd-id
  for (const el of elements) {
    if (seen[el.content_hash]) {
      el.duplicate_of = seen[el.content_hash];
    } else {
      seen[el.content_hash] = el['cdd-id'];
    }
  }
  return elements;
}

// ---------------------------------------------------------------------------
// ID in HTML injizieren
// ---------------------------------------------------------------------------
function injectIds(html, elements) {
  // Lookup: content_hash → cdd-id (canonical first)
  const hashToId = {};
  for (const el of elements) {
    if (!el.duplicate_of && !hashToId[el.content_hash]) {
      hashToId[el.content_hash] = el['cdd-id'];
    }
  }
  // Auch für Duplikate das original eintragen
  for (const el of elements) {
    if (el.duplicate_of && !hashToId[el.content_hash]) {
      hashToId[el.content_hash] = el.duplicate_of;
    }
  }

  return html.replace(/<([a-zA-Z][^\s>/]*)([^>]*)>/g, (match, tag, attrStr) => {
    const t = tag.toLowerCase();
    if (SKIP_TAGS.has(t) || !VISIBLE_TAGS.has(t)) return match;
    if (attrStr.includes('data-cdd-id')) return match;

    const classes = (attrStr.match(/class="([^"]*)"/) || [])[1]?.split(/\s+/).filter(Boolean) || [];
    const hash = crypto.createHash('sha256')
      .update(`${t}|${[...classes].sort().join(',')}`)
      .digest('hex').slice(0, 12);

    const cddId = hashToId[hash];
    if (!cddId) return match;

    return `<${tag} data-cdd-id="${cddId}"${attrStr}>`;
  });
}

// ---------------------------------------------------------------------------
// Argument-Parsing
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1] || true;
      i++;
    }
  }
  return args;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv);
  const inputDir  = args['input'];
  const outputFile = args['output'];
  const injectDir  = args['inject-dir'] || null;

  if (!inputDir || !outputFile) {
    console.error('Usage: node deduplicate_and_parse.js --input <dir> --output <file> [--inject-dir <dir>]');
    process.exit(1);
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`[ERROR] Input-Ordner nicht gefunden: ${inputDir}`);
    process.exit(1);
  }

  const htmlFiles = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(f => path.join(inputDir, f));

  if (htmlFiles.length === 0) {
    console.error(`[ERROR] Keine .html-Dateien in ${inputDir}`);
    process.exit(1);
  }

  console.log(`[INFO] Verarbeite ${htmlFiles.length} HTML-Datei(en)...`);

  const allElements = [];
  const fileHashes  = [];

  for (const htmlFile of htmlFiles) {
    const raw = fs.readFileSync(htmlFile, 'utf8');
    const fileHash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
    const fileName = path.basename(htmlFile);

    const elements = parseElements(raw, fileName);
    allElements.push(...elements);
    fileHashes.push({ file: fileName, hash: fileHash });
    console.log(`  ✓ ${fileName}: ${elements.length} Elemente gefunden`);
  }

  // Deduplizierung
  deduplicate(allElements);
  const canonicals = allElements.filter(e => !e.duplicate_of).length;
  const dupes      = allElements.filter(e =>  e.duplicate_of).length;
  console.log(`[INFO] Canonicals: ${canonicals} | Duplikate: ${dupes}`);

  // ID-Injektion
  if (injectDir) {
    fs.mkdirSync(injectDir, { recursive: true });
    for (const htmlFile of htmlFiles) {
      const raw = fs.readFileSync(htmlFile, 'utf8');
      const fileName = path.basename(htmlFile);
      const fileElements = allElements.filter(e => e.source_file === fileName);
      const injected = injectIds(raw, fileElements);
      const outPath = path.join(injectDir, fileName);
      fs.writeFileSync(outPath, injected, 'utf8');
      console.log(`  ✓ Injiziert: ${outPath}`);
    }
  }

  // JSON-Output
  const output = {
    metadata: {
      generated_on: new Date().toISOString(),
      script_version: '1.0.0',
      source_dir: inputDir,
      total_elements: allElements.length,
      canonical_elements: canonicals,
      duplicate_elements: dupes,
    },
    processed_files: fileHashes,
    elements: allElements,
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`[OK] JSON-Output geschrieben: ${outputFile}`);
}

main();
