function splitIntoMeasures(tokens) {
  const measures = [];
  let cur = [];
  for (const t of tokens) {
    if (t.type === 'barline') {
      if (cur.length) { measures.push(cur); cur = []; }
    } else {
      cur.push(t);
    }
  }
  if (cur.length) measures.push(cur);
  return measures;
}

function noteClass(note, currentNoteIndex) {
  return [
    'sargam-token',
    note.octave === 1 ? 'upper' : note.octave === -1 ? 'lower' : '',
    note.type === 'rest' ? 'sargam-rest' : '',
    note.noteIndex === currentNoteIndex ? 'active' : '',
  ].filter(Boolean).join(' ');
}

export default function SargamView({ items, currentNoteIndex }) {
  return (
    <div className="sargam-view">
      <div className="sargam-inner">
        {items.map((item, i) => {
          if (item.type === "section") {
            return <div key={i} className="sargam-section-break" />;
          }

          return splitIntoMeasures(item.tokens).map((measure, mi) => (
            <div key={`${i}-${mi}`} className="sargam-measure">
              {measure.map((token, j) => {
                if (token.type === "group") {
                  const gDur = token.tokens.reduce((s, t) => s + (t.duration ?? 1), 0);
                  return (
                    <span key={j} className="sargam-slot" style={{ flex: gDur }}>
                      <span className="sargam-group">
                        {token.tokens.map((t, k) => (
                          <span key={k} className={noteClass(t, currentNoteIndex)}>
                            {t.type === "rest" ? "—" : t.label}
                          </span>
                        ))}
                      </span>
                    </span>
                  );
                }
                return (
                  <span key={j} className="sargam-slot" style={{ flex: token.duration ?? 1 }}>
                    <span className={noteClass(token, currentNoteIndex)}>
                      {token.type === "rest" ? "—" : token.label}
                    </span>
                  </span>
                );
              })}
            </div>
          ));
        })}
      </div>
    </div>
  );
}
