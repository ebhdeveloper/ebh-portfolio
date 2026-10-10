export function HeroArtwork({
  web,
  mobile,
  caption,
}: {
  web: string;
  mobile: string;
  caption: string;
}) {
  return (
    <div className="pf-hero-visual" aria-hidden="true">
      <div className="pf-visual-grid" />
      <div className="pf-object">
        <div className="pf-orbit pf-orbit-one" />
        <div className="pf-orbit pf-orbit-two" />
        <div className="pf-orbit pf-orbit-three" />
        <div className="pf-core">
          <span className="pf-object-label" dir="ltr">
            Ebh
          </span>
        </div>
      </div>
      <div className="pf-floating pf-float-web">
        <span className="pf-dot" />
        {web}
      </div>
      <div className="pf-floating pf-float-mobile">
        <span className="pf-dot" />
        {mobile}
      </div>
      <span className="pf-visual-caption">{caption}</span>
    </div>
  );
}
