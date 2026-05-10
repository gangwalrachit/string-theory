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

function SargamToken({ token, currentNoteIndex }) {
  const isActive = token.noteIndex === currentNoteIndex;
  const octaveClass = token.octave === 1 ? " upper" : token.octave === -1 ? " lower" : "";
  const restClass = token.type === "rest" ? " sargam-rest" : "";
  const activeClass = isActive ? " active" : "";

  return (
    <span className="sargam-slot" style={{ flex: token.duration ?? 1 }}>
      <span className={`sargam-token${octaveClass}${restClass}${activeClass}`}>
        {token.type === "rest" ? "—" : token.label}
      </span>
    </span>
  );
}

export default function SargamView({ items, currentNoteIndex }) {
  return (
    <div className="sargam-view">
      <div className="sargam-inner">
        {items.map((item, i) => {
          if (item.type === "section") {
            return <div key={i} className="sargam-section-break" />;
          }

          return splitIntoMeasures(item.tokens).map((measure, mi) => {
            const gFlex = (t) => t.tokens.reduce((s, n) => s + (n.duration ?? 1), 0);
            return (
              <div key={`${i}-${mi}`} className="sargam-measure">
                {measure.map((token, j) => {
                  if (token.type === "group") {
                    return (
                      <span key={j} className="sargam-group" style={{ flex: gFlex(token) }}>
                        {token.tokens.map((t, k) => (
                          <SargamToken key={k} token={t} currentNoteIndex={currentNoteIndex} />
                        ))}
                      </span>
                    );
                  }
                  return <SargamToken key={j} token={token} currentNoteIndex={currentNoteIndex} />;
                })}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
