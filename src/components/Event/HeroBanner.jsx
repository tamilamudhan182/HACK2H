function HeroBanner({ attendee, stats, headline }) {
  return (
    <section className="hero-panel fade-in">
      <div className="hero-panel__copy">
        <div className="hero-panel__eyebrow">
          <span>Smart Event Companion</span>
          <span>Live Stadium OS</span>
        </div>
        <h1>Navigate the venue, skip the chaos, and keep every scan in one QR wallet.</h1>
        <p>
          Unified access, crowd-aware routing, virtual queueing, group coordination,
          emergency guidance, and post-match transport all update live for {attendee.name}.
        </p>
        <div className="hero-panel__chips">
          <span className="chip">Seat {attendee.seatLabel}</span>
          <span className="chip">Group {attendee.groupName}</span>
          <span className="chip">AI route confidence {headline.confidence}</span>
        </div>
        <div className="hero-panel__route-card">
          <p className="section-label">Live route insight</p>
          <strong>{headline.advisory}</strong>
          <span>{headline.eta} min ETA with real-time crowd balancing.</span>
        </div>
      </div>

      <div className="hero-panel__stats">
        {stats.map((stat) => (
          <article key={stat.label} className={`stat-card stat-card--${stat.tone}`}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
