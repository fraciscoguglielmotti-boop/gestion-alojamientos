'use client'

import { useEffect, useRef, useState } from 'react'

/* Imagery — grayscale-filtered stock (see CSS) unifies the palette and keeps
   the monochrome, editorial look. Falls back to a dark ground if a photo
   fails to load. Swap for Romano Glass's own photography in production. */
const IMG = {
  about: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=70',
  balustrade: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=70',
  doors: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=70',
  shower: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=70',
  splash: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=70',
  stair: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=70',
  pool: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=70',
}
// Sydney footage for the hero. Swap HERO_VIDEO for the client's own drone reel
// (or a licensed Sydney clip). Graceful fallback chain: if the video fails,
// the Sydney poster shows; if that fails too, a generated skyline sits behind.
const HERO_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-sydney-harbour-bridge-and-opera-house-4468-large.mp4'
const HERO_POSTER = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=70'

function hideImg(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

const SOLUTIONS = [
  { n: 'Balcony Balustrades', no: '01', img: IMG.balustrade },
  { n: 'Internal Glass Doors', no: '02', img: IMG.doors },
  { n: 'Frameless Showers', no: '03', img: IMG.shower },
  { n: 'Glass Splashbacks', no: '04', img: IMG.splash },
  { n: 'Staircase Glazing', no: '05', img: IMG.stair },
  { n: 'Glass Pool Fencing', no: '06', img: IMG.pool },
]

const SERVICES = [
  { no: '01', t: 'Consultancy', d: 'Reading the space and advising on glass, thickness and detail.' },
  { no: '02', t: 'Surveying', d: 'Laser-precise on-site measurement — no templates, no guesswork.' },
  { no: '03', t: 'Fabrication', d: 'Cut, toughened and edge-polished in our Five Dock workshop.' },
  { no: '04', t: 'Installation', d: 'Fitted by the same hands that measured, finished on time.' },
]

const MATERIALS = [
  { n: 'Low-Iron', d: 'Ultra-clear glass with a true, colourless edge.' },
  { n: 'Toughened', d: 'Safety-grade strength for showers, stairs and pools.' },
  { n: 'Laminated', d: 'Acoustic and structural performance in a single pane.' },
  { n: 'Textured', d: 'Fluted, satin and patterned finishes for privacy.' },
  { n: 'Mirror', d: 'Clear, bronze and antique finishes, cut to size.' },
]

function Caret() {
  return (
    <svg className="caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function RomanoGlassPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const header = root.querySelector('header')
    const onScroll = () => header?.classList.toggle('solid', window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    root.querySelectorAll('.rv').forEach((el) => io.observe(el))

    // animated monochrome sky behind the hero video (fallback ambience)
    const sky = root.querySelector<HTMLCanvasElement>('#sky')
    let raf = 0
    if (sky) {
      let ctx = sky.getContext('2d')!
      let W = 0
      let H = 0
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const r = sky.getBoundingClientRect()
        sky.width = Math.max(1, Math.round(r.width * dpr))
        sky.height = Math.max(1, Math.round(r.height * dpr))
        ctx = sky.getContext('2d')!
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        W = r.width
        H = r.height
      }
      fit()
      const draw = (t: number) => {
        const g = ctx.createLinearGradient(0, 0, 0, H)
        g.addColorStop(0, '#20211f')
        g.addColorStop(0.45, '#34332e')
        g.addColorStop(0.75, '#4a463f')
        g.addColorStop(1, '#5b564c')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        const gx = W * (0.28 + 0.12 * Math.sin(t * 0.05))
        const gy = H * (0.34 + 0.05 * Math.cos(t * 0.04))
        const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, H * 0.9)
        rg.addColorStop(0, 'rgba(255,250,240,0.5)')
        rg.addColorStop(0.4, 'rgba(255,248,235,0.14)')
        rg.addColorStop(1, 'rgba(255,248,235,0)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, W, H)
      }
      let t = 0
      const loop = () => {
        t += 0.016
        draw(t)
        raf = requestAnimationFrame(loop)
      }
      if (reduce) draw(3)
      else raf = requestAnimationFrame(loop)
      const onResize = () => {
        fit()
        if (reduce) draw(3)
      }
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        io.disconnect()
        cancelAnimationFrame(raf)
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const toggleTheme = () => {
    const root = rootRef.current
    if (!root) return
    let cur = root.getAttribute('data-theme')
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="rg" ref={rootRef} id="top">
      <header>
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Romano Glass">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect x="6.7" y="6.7" width="26.6" height="26.6" transform="rotate(45 20 20)" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="wm">
              <b>ROMANO</b>
              <span>GLASS</span>
            </span>
          </a>
          <nav className="menu" aria-label="Primary">
            <div><a className="item" href="#top">Home</a></div>
            <div>
              <button className="item">Solutions <Caret /></button>
              <div className="dropdown">
                <a href="#solutions">Balcony Balustrades</a>
                <a href="#solutions">Internal Glass Doors</a>
                <a href="#solutions">Frameless Shower Screens</a>
                <a href="#solutions">Staircase Glazing</a>
                <a href="#solutions">Partitions &amp; Facades</a>
              </div>
            </div>
            <div>
              <button className="item">Services <Caret /></button>
              <div className="dropdown">
                <a href="#services">Design Consultancy</a>
                <a href="#services">Technical Surveying</a>
                <a href="#services">Fabrication</a>
                <a href="#services">Installation</a>
              </div>
            </div>
            <div>
              <button className="item">Tailor-Made <Caret /></button>
              <div className="dropdown">
                <a href="#who">Bespoke Projects</a>
                <a href="#who">Curved &amp; Patterned Glass</a>
                <a href="#who">Architectural Collaboration</a>
              </div>
            </div>
            <div><a className="item" href="#materials">Materials</a></div>
            <div><a className="item" href="#who">Who We Are</a></div>
            <div><a className="item" href="#contact">Contact</a></div>
          </nav>
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M19 5l-1.7 1.7M6.7 17.3 5 19M19 19l-1.7-1.7M6.7 6.7 5 5" />
            </svg>
          </button>
          <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`msheet${menuOpen ? ' open' : ''}`}>
        <div className="top">
          <span className="wm" style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.2rem', letterSpacing: '.3em' }}>ROMANO GLASS</span>
          <button className="close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        </div>
        {['Home', 'Solutions', 'Services', 'Tailor-Made', 'Materials', 'Who We Are', 'Contact'].map((m) => {
          const href = m === 'Home' ? '#top' : m === 'Tailor-Made' || m === 'Who We Are' ? '#who' : `#${m.toLowerCase()}`
          return (
            <a key={m} href={href} onClick={() => setMenuOpen(false)}>{m}</a>
          )
        })}
      </div>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-scene">
            <canvas id="sky" aria-hidden="true" />
            <svg className="hero-skyline" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <g fill="currentColor">
                <rect x="1030" y="150" width="46" height="270" />
                <rect x="1086" y="205" width="34" height="215" />
                <rect x="1128" y="120" width="54" height="300" />
                <path d="M1155 120 l0 -46 l6 0 l0 46 z" />
                <rect x="1192" y="235" width="40" height="185" />
                <rect x="1240" y="180" width="60" height="240" />
                <rect x="1310" y="255" width="34" height="165" />
                <rect x="1352" y="150" width="72" height="270" />
                <rect x="1434" y="220" width="44" height="200" />
                <rect x="1486" y="285" width="60" height="135" />
                <path d="M868 392 Q900 250 952 392 Z" />
                <path d="M912 392 Q950 232 1000 392 Z" />
                <path d="M958 392 Q1000 262 1044 392 Z" />
                <rect x="860" y="384" width="200" height="8" />
                <path d="M120 360 Q470 150 820 360 L820 372 Q470 176 120 372 Z" />
                <rect x="118" y="300" width="704" height="7" />
                <rect x="190" y="240" width="20" height="152" />
                <rect x="730" y="240" width="20" height="152" />
                <g stroke="currentColor" strokeWidth="2">
                  <line x1="250" y1="284" x2="250" y2="303" />
                  <line x1="320" y1="256" x2="320" y2="303" />
                  <line x1="390" y1="238" x2="390" y2="303" />
                  <line x1="470" y1="230" x2="470" y2="303" />
                  <line x1="550" y1="238" x2="550" y2="303" />
                  <line x1="620" y1="256" x2="620" y2="303" />
                  <line x1="690" y1="284" x2="690" y2="303" />
                </g>
              </g>
            </svg>
            <video className="hero-video" autoPlay muted loop playsInline poster={HERO_POSTER}>
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
            <div className="hero-vignette" />
          </div>
          <div className="wrap hero-inner">
            <span className="eyebrow">Architectural Glass · Sydney</span>
            <h1>The substance that shapes the project.</h1>
            <p className="sub">Bespoke glass, drawn and made in Sydney — where precision meets the way light moves through a space.</p>
            <div className="hero-cta">
              <a className="btn btn-solid" href="#solutions">Explore our work</a>
              <a className="btn btn-line" href="#contact">Start a project <ArrowUpRight /></a>
            </div>
          </div>
          <div className="scroll-cue"><span>Scroll</span><span className="bar" /></div>
        </section>

        {/* ABOUT */}
        <section className="blk about" id="about">
          <div className="wrap about-grid">
            <div className="about-visual rv">
              <img className="photo" src={IMG.about} alt="Glazed partition in a Sydney interior" onError={hideImg} />
              <span className="cap">Glazed partition · Sydney</span>
            </div>
            <div className="rv">
              <div className="kicker" />
              <span className="eyebrow">The substance that shapes the project</span>
              <h2>Romano Glass</h2>
              <div className="lead">
                <p><b>Every element is connected.</b> In our work, this connection emerges between precision and perception — between functional intent and aesthetic value.</p>
                <p>We combine artisanal mastery with contemporary research to create spaces that are coherent, luminous, and uniquely tailored.</p>
                <p>Environments defined by our profiles become a dialogue of balance, transparency, and architecture — because in every project, the most meaningful connection is the one between those who design, those who shape, and those who inhabit the space.</p>
              </div>
              <a className="link-i" href="#who">About us <span>›››</span></a>
            </div>
          </div>
        </section>

        {/* SOLUTIONS */}
        <section className="blk solutions" id="solutions">
          <div className="wrap">
            <div className="sol-head rv">
              <div className="ghost">All Our<br />Solutions</div>
              <span className="eyebrow">Explore the design of glass</span>
            </div>
            <div className="sol-grid">
              {SOLUTIONS.map((s) => (
                <article className="sol-card rv" key={s.no}>
                  <div className="img">
                    <img className="photo" src={s.img} alt={s.n} onError={hideImg} />
                    <span className="arrow"><ArrowUpRight /></span>
                  </div>
                  <div className="meta"><span className="n">{s.n}</span><span className="no">{s.no}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="blk services" id="services">
          <div className="wrap services-grid">
            <div className="rv">
              <div className="kicker on-dark" />
              <span className="eyebrow">Beyond simple consultancy</span>
              <h2 style={{ marginTop: 16 }}>Services as<br />part of design.</h2>
              <div className="copy">
                <p>For us, the process is an integral part of the result. We oversee every phase with the same attention given to an architectural detail — from preliminary consultation to installation, from technical surveying to the management of bespoke solutions.</p>
                <p>Quality lies not only in the final product, but in the way it is achieved. Our method blends engineering precision with design sensitivity.</p>
              </div>
              <a className="link-i" href="#contact">Learn more <span>›››</span></a>
            </div>
            <div className="svc-list rv">
              {SERVICES.map((s) => (
                <div className="svc-row" key={s.no}>
                  <span className="no">{s.no}</span>
                  <span className="t">{s.t}</span>
                  <span className="d">{s.d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MATERIALS */}
        <section className="blk materials" id="materials">
          <div className="wrap">
            <div className="mat-head rv">
              <h2>Materials, chosen<br />for the light.</h2>
              <span className="eyebrow" style={{ maxWidth: '26ch', textAlign: 'right' }}>Low-iron clarity, texture and tone — matched to each project.</span>
            </div>
            <div className="mat-row rv">
              {MATERIALS.map((m) => (
                <div className="mat" key={m.n}><div className="n">{m.n}</div><div className="d">{m.d}</div></div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO */}
        <section className="blk who" id="who">
          <div className="wrap who-grid">
            <div className="rv">
              <div className="kicker" />
              <span className="eyebrow">Who we are</span>
              <h2>An Italian glazier&apos;s eye,<br />at home in Sydney.</h2>
              <p>Founded in 2008 and based in Five Dock, Romano Glass brings more than a quarter of a century of craftsmanship to residential and commercial projects across the city. We keep design, fabrication and installation under one roof — so nothing is lost between the drawing and the finished edge.</p>
              <a className="link-i" href="#contact" style={{ marginTop: 28 }}>Work with us <span>›››</span></a>
            </div>
            <div className="stats rv">
              <div className="stat"><div className="n">2008</div><div className="l">Established in Sydney</div></div>
              <div className="stat"><div className="n">25+</div><div className="l">Years of craft</div></div>
              <div className="stat"><div className="n">1,200+</div><div className="l">Projects delivered</div></div>
              <div className="stat"><div className="n">100%</div><div className="l">Custom made to measure</div></div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="blk contact" id="contact">
          <div className="wrap contact-grid">
            <div className="rv">
              <div className="kicker on-dark" />
              <span className="eyebrow">Contact</span>
              <h2>Let&apos;s shape<br />your project.</h2>
              <p className="sub">Visit the Five Dock workshop or send your project details — we reply within one business day.</p>
              <div className="cinfo">
                <div className="row"><span className="k">Workshop</span><span className="v">Unit 2 / 24 Spencer St, Five Dock NSW 2046</span></div>
                <a href="tel:+61466126937"><span className="k">Phone</span><span className="v">0466 126 937</span></a>
                <a href="mailto:info@romanoglass.com.au"><span className="k">Email</span><span className="v">info@romanoglass.com.au</span></a>
                <div className="row"><span className="k">Hours</span><span className="v">Mon–Fri 7–4 · Sat by appointment</span></div>
              </div>
            </div>
            <form
              className="rv"
              onSubmit={(e) => {
                e.preventDefault()
                const note = e.currentTarget.querySelector('.form-note')
                if (note) note.textContent = 'Thank you — this is a design preview. On the live site this sends straight to info@romanoglass.com.au.'
              }}
            >
              <div className="fld row2">
                <div><label htmlFor="n">Name</label><input id="n" type="text" placeholder="Your name" required /></div>
                <div><label htmlFor="p">Phone</label><input id="p" type="tel" placeholder="04xx xxx xxx" /></div>
              </div>
              <div className="fld"><label htmlFor="e">Email</label><input id="e" type="email" placeholder="you@email.com" required /></div>
              <div className="fld">
                <label htmlFor="s">Project</label>
                <select id="s">
                  <option>Balcony balustrades</option>
                  <option>Internal glass doors</option>
                  <option>Frameless shower screen</option>
                  <option>Glass splashback</option>
                  <option>Staircase glazing</option>
                  <option>Glass pool fencing</option>
                  <option>Bespoke / tailor-made</option>
                </select>
              </div>
              <div className="fld"><label htmlFor="m">Tell us about the space</label><textarea id="m" placeholder="Location, timeframe, any measurements you have…" /></div>
              <button className="btn btn-solid" type="submit">Send enquiry <ArrowUpRight /></button>
              <p className="form-note">We reply within one business day.</p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <span className="wm"><b>ROMANO</b><span>GLASS</span></span>
              <p>Bespoke architectural glass, drawn and made in Sydney since 2008.</p>
            </div>
            <div className="foot-col">
              <h4>Solutions</h4>
              <a href="#solutions">Balustrades</a>
              <a href="#solutions">Glass doors</a>
              <a href="#solutions">Shower screens</a>
              <a href="#solutions">Splashbacks</a>
              <a href="#solutions">Pool fencing</a>
            </div>
            <div className="foot-col">
              <h4>Studio</h4>
              <a href="#services">Services</a>
              <a href="#materials">Materials</a>
              <a href="#who">Who we are</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="foot-col">
              <h4>Visit</h4>
              <a href="#contact">Unit 2 / 24 Spencer St</a>
              <a href="#contact">Five Dock, NSW 2046</a>
              <a href="tel:+61466126937">0466 126 937</a>
              <a href="mailto:info@romanoglass.com.au">info@romanoglass.com.au</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Romano Glass. All rights reserved.</span>
            <span>Architectural glazing · Sydney</span>
          </div>
        </div>
      </footer>

      <a className="wa" href="#contact" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.45-.15-.64.15-.19.28-.73.94-.9 1.13-.16.19-.33.21-.62.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38 0 1.4 1.02 2.76 1.17 2.95.14.19 2.01 3.08 4.88 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2z" />
        </svg>
      </a>
    </div>
  )
}
