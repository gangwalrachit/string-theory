function SargamToken({ token, currentNoteIndex }) {
  if (token.type === "barline") {
    return <span className="sargam-barline" aria-hidden="true">|</span>;
  }

  const isActive = token.noteIndex === currentNoteIndex;
  const octaveClass = token.octave === 1 ? " upper" : token.octave === -1 ? " lower" : "";
  const restClass = token.type === "rest" ? " sargam-rest" : "";
  const activeClass = isActive ? " active" : "";

  return (
    <span className={`sargam-token${octaveClass}${restClass}${activeClass}`}>
      {token.type === "rest" ? "—" : token.label}
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

          return (
            <div key={i} className="sargam-row">
              {item.tokens.map((token, j) => {
                if (token.type === "group") {
                  const isGroupActive = token.tokens.some(t => t.noteIndex === currentNoteIndex);
                  return (
                    <span key={j} className={`sargam-group${isGroupActive ? " active" : ""}`}>
                      <span className="sargam-group-notes">
                        {token.tokens.map((t, k) => (
                          <SargamToken key={k} token={t} currentNoteIndex={currentNoteIndex} />
                        ))}
                      </span>
                      <svg className="sargam-slur" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M 2 2 Q 50 8 98 2" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </span>
                  );
                }

                return <SargamToken key={j} token={token} currentNoteIndex={currentNoteIndex} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
