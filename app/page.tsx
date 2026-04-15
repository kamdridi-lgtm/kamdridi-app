const topNav = [
  "HOME",
  "MUSIC",
  "STORE",
  "BUSINESS",
  "FAN CLUB",
  "GAMES",
  "VISUAL ALBUM",
  "WHO IS KAM DRIDI",
  "CONTACT",
];

const subNav = ["EXPLORE", "COMPANION", "GET APP", "ECHOES ENGINE", "NEWS", "MEDIA", "BAND", "TOUR", "PRESS KIT"];

const platforms = ["APPLE MUSIC", "SPOTIFY", "AMAZON MUSIC", "DEEZER"];

export default function Home() {
  return (
    <main className="site-bg min-h-screen text-zinc-100">
      <div className="mx-auto max-w-[1260px] px-4 py-5 md:px-7">
        <header className="panel">
          <div className="border-b border-white/10 px-5 py-5 md:px-8">
            <div className="flex flex-wrap items-center gap-5 xl:flex-nowrap xl:justify-between">
              <div className="logo-wrap">
                <div className="logo-mark" />
                <div>
                  <p className="logo-title">KAMDRIDI</p>
                  <p className="logo-sub">ECHOES</p>
                  <p className="logo-sub text-red-400">UNEARTHED</p>
                  <p className="logo-sub">UNIVERSE</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[1.8rem] leading-none tracking-[0.08em]">
                {topNav.map((item) => (
                  <button key={item} className="top-link" type="button">
                    {item}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-4 text-sm tracking-wider">
                <span className="lang-pill">EN</span>
                <span className="muted">FR</span>
                <span className="muted">SP</span>
                <span className="muted">AR</span>
                <span className="muted">CART</span>
                <span className="count">1</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              {subNav.map((item) => (
                <button key={item} className="sub-chip" type="button">
                  {item}
                </button>
              ))}
              <span className="lang-pill ml-auto">EN</span>
              <span className="muted">FR</span>
              <span className="muted">SP</span>
              <span className="muted">AR</span>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-[1.8fr_repeat(4,1fr)]">
          <article className="card main-release">
            <div className="cover-art" />
            <div>
              <p className="tiny">LISTEN NOW</p>
              <h1 className="release-title">WAR MACHINES IS LIVE</h1>
              <p className="desc">Stream the current KAMDRIDI single across the official platform links below.</p>
            </div>
          </article>

          {platforms.map((item) => (
            <article key={item} className="card platform-card">
              <div className="play-icon">▶</div>
              <p className="tiny">{item}</p>
              <p className="platform-title">War Machines</p>
            </article>
          ))}
        </section>

        <section className="mt-7 overflow-hidden rounded-[28px] border border-white/15">
          <div className="hero-image" />
        </section>

        <section className="mt-7 panel p-6 md:p-9">
          <h2 className="section-title">THE SOUND AND IMAGE CORE OF ECHOES UNEARTHED</h2>
          <p className="mt-3 max-w-4xl text-2xl leading-relaxed text-zinc-300">
            A premium music hub for official audio, visual world-building, gallery imagery, and the release timeline that
            anchors the KAMDRIDI universe.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="media-art" />
            <div className="rounded-[24px] border border-white/15 bg-white/[0.03] p-8">
              <p className="tiny">NOW PLAYING</p>
              <h3 className="text-6xl leading-tight">War Machines | Official Audio</h3>
              <p className="mt-4 text-2xl text-zinc-300 leading-relaxed">
                Official audio for War Machines, presented as the current featured media release inside the Echoes
                Unearthed campaign.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7 panel p-6 md:p-9">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="tiny">WHO IS KAM DRIDI</p>
              <h3 className="archive-title">A COMIC ARCHIVE INSIDE THE ECHOES UNEARTHED WORLD</h3>
              <p className="mt-4 text-2xl text-zinc-300 leading-relaxed">
                Read through the responsive comic-style presentation and move through the artist mythology with a clean
                page viewer.
              </p>
            </div>
            <div className="archive-art" />
          </div>
        </section>
      </div>
    </main>
  );
}
