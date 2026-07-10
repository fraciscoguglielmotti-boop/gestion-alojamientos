'use client'

import { useEffect, useRef, useState } from 'react'

/* Luminous stock imagery — bright, warm interiors and architectural glass.
   Each slot sits on a warm gradient (see CSS) so nothing is ever empty if a
   photo fails to load. Swap for Romano Glass's own photography in production. */
const IMG = {
  hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=75',
  interior: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=75',
  craft: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=75',
  balustrade: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=75',
  doors: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=75',
  shower: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=75',
  splash: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=75',
  projA: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=75',
  projB: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=75',
  projC: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=75',
  cta: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=75',
}

function hideImg(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
const Circ = () => (
  <span className="circ"><ArrowUpRight /></span>
)

const SOLUTIONS = [
  { n: 'Balcony Balustrades', c: 'Frameless, seamless views', tag: 'Balconies', img: IMG.balustrade },
  { n: 'Internal Glass Doors', c: 'Light between rooms', tag: 'Interiors', img: IMG.doors },
  { n: 'Frameless Showers', c: 'Low-iron, polished edges', tag: 'Bathroom', img: IMG.shower },
  { n: 'Glass Splashbacks', c: 'Colour-matched, seamless', tag: 'Kitchen', img: IMG.splash },
]
const SERVICES = [
  { no: '01', t: 'Consultancy', d: 'Reading the space and advising on glass, thickness and detail.' },
  { no: '02', t: 'Surveying', d: 'Laser-precise on-site measurement — no templates, no guesswork.' },
  { no: '03', t: 'Fabrication', d: 'Cut, toughened and edge-polished in our Five Dock workshop.' },
  { no: '04', t: 'Installation', d: 'Fitted by the same hands that measured, finished on time.' },
]
const MATERIALS = [
  { n: 'Low-Iron', d: 'Ultra-clear with a true, colourless edge.' },
  { n: 'Toughened', d: 'Safety-grade strength for showers and pools.' },
  { n: 'Laminated', d: 'Acoustic and structural in one pane.' },
  { n: 'Textured', d: 'Fluted and satin finishes for privacy.' },
  { n: 'Mirror', d: 'Clear, bronze and antique, cut to size.' },
]

export default function RomanoGlassPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
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
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    )
    root.querySelectorAll('.rv').forEach((el) => io.observe(el))
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
            <svg className="dia" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" stroke="currentColor" strokeWidth="1.4" />
              <rect x="15" y="15" width="10" height="10" transform="rotate(45 20 20)" stroke="currentColor" strokeWidth="1" opacity=".6" />
            </svg>
            <span className="wm">Romano&nbsp;Glass</span>
          </a>
          <nav className="menu" aria-label="Primary">
            <a href="#top" className="active">Home</a>
            <a href="#solutions">Solutions</a>
            <a href="#craft">Craft</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="nav-right">
            <div className="socials">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.3-1.4 1.5-1.4h1.3V5.6c-.6-.1-1.4-.2-2.2-.2-2.2 0-3.6 1.3-3.6 3.7v2.1H8v2.8h2.2V21z" /></svg></a>
            </div>
            <a className="phone" href="tel:+61466126937"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5c0 9 6 15 15 15l-1-4-4-1-2 2c-2-1-4-3-5-5l2-2-1-4z" /></svg>0466 126 937</a>
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M19 5l-1.7 1.7M6.7 17.3 5 19M19 19l-1.7-1.7M6.7 6.7 5 5" /></svg></button>
            <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
          </div>
        </div>
      </header>

      <div className={`msheet${menuOpen ? ' open' : ''}`}>
        <div className="top"><span className="wm">Romano Glass</span><button className="close" onClick={() => setMenuOpen(false)} aria-label="Close">×</button></div>
        {['Home', 'Solutions', 'Craft', 'Services', 'Projects', 'Contact'].map((m) => (
          <a key={m} href={m === 'Home' ? '#top' : `#${m.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{m}</a>
        ))}
      </div>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-frame">
            <img className="bg" src={IMG.hero} alt="Luminous Sydney home with architectural glass" onError={hideImg} />
            <div className="hero-scrim" />
            <div className="hero-top">
              <div className="wrap">
                <div className="kick"><span className="eyebrow">Architectural Glass · Sydney since 2008</span><span>Where light<br />shapes the space</span></div>
                <div className="hero-wordmark">Romano Glass</div>
              </div>
            </div>
            <div className="wrap hero-inner">
              <div className="row">
                <div>
                  <h1>Bespoke glass, shaped by the way <em>light</em> moves through a home.</h1>
                  <p className="sub">From frameless showers to sweeping balustrades — designed, made and installed with an Italian glazier&apos;s eye.</p>
                </div>
                <div className="hero-stats">
                  <div className="stat-card"><div className="n">2008</div><div className="l">Crafting in Sydney</div></div>
                  <div className="stat-card"><div className="n">1,200+</div><div className="l">Projects delivered</div></div>
                </div>
              </div>
              <div className="hero-cta">
                <a className="pill discover" href="#solutions">Discover more <Circ /></a>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="blk exp">
          <div className="wrap">
            <div className="head rv">
              <span className="eyebrow">The substance that shapes the project</span>
              <h2 className="sec-title">Experience excellence<br />in architectural <em>glass</em></h2>
            </div>
            <div className="exp-grid">
              <div className="exp-col rv">
                <h3>Your trusted partner in glass</h3>
                <p>We believe a renovation should feel effortless. From the first measure to the final polish, every pane is considered, made to order and fitted with care.</p>
                <a className="pill" href="#craft" style={{ marginTop: 24 }}>About us <Circ /></a>
              </div>
              <div className="exp-photo rv"><img className="photo" src={IMG.interior} alt="Warm sunlit interior with glass" onError={hideImg} /></div>
              <div className="exp-col rv">
                <div className="feat"><h4>Expert guidance</h4><p>Experienced glaziers who advise on glass, thickness and detail — not just take an order.</p></div>
                <div className="feat"><h4>Wide selection</h4><p>Low-iron, toughened, laminated, textured and mirror — matched to each space.</p></div>
                <div className="reviews"><div className="avatars"><span /><span /><span /><span /></div><div><div className="r">5.0</div><div className="rl">Client rating</div></div></div>
                <div className="partners"><div className="p"><span className="dot" />Insured</div><div className="p"><span className="dot" />Licensed</div><div className="p"><span className="dot" />Sydney-wide</div></div>
              </div>
            </div>
            <div className="features rv">
              <div className="f"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V9l8-5 8 5v11M4 20h16M9 20v-6h6v6" /></svg></div><h4>Made to measure</h4><p>Every piece cut for your space</p></div>
              <div className="f"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 8c0-2 3-3 7-3s7 1 7 3M5 8v8c0 2 3 3 7 3s7-1 7-3V8" /></svg></div><h4>Low-iron clarity</h4><p>True, colourless glass</p></div>
              <div className="f"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 5 5.6.8-4 4 1 5.5L12 20l-5 2.3 1-5.5-4-4 5.6-.8z" /></svg></div><h4>Crafted finish</h4><p>Polished edges, premium hardware</p></div>
              <div className="f"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l2-6h11l3 4h2v4H3zM7 17a2 2 0 104 0M15 17a2 2 0 104 0" /></svg></div><h4>On-time install</h4><p>Fitted clean, finished on time</p></div>
            </div>
          </div>
        </section>

        {/* SOLUTIONS */}
        <section className="blk solutions" id="solutions">
          <div className="wrap">
            <div className="sol-head rv">
              <h2>Explore the <em>design</em><br />of glass</h2>
              <a className="link-i" href="#projects">View all solutions ›</a>
            </div>
            <div className="sol-grid">
              {SOLUTIONS.map((s) => (
                <article className="sol-card rv" key={s.n}>
                  <img className="photo" src={s.img} alt={s.n} onError={hideImg} />
                  <span className="tag">{s.tag}</span>
                  <div className="meta"><div className="n">{s.n}</div><div className="c">{s.c}</div></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CRAFT */}
        <section className="blk craft" id="craft">
          <div className="wrap craft-grid">
            <div className="rv">
              <span className="eyebrow">Who we are</span>
              <h2>An Italian glazier&apos;s eye,<br />at home in <em>Sydney</em>.</h2>
              <p>Founded in 2008 and based in Five Dock, Romano Glass brings more than a quarter of a century of craftsmanship to residential and commercial projects. We keep design, fabrication and installation under one roof — so nothing is lost between the drawing and the finished edge.</p>
              <a className="pill light" href="#contact">Meet the studio <Circ /></a>
            </div>
            <div className="craft-visual rv"><img className="photo" src={IMG.craft} alt="Glazed partition in a Five Dock project" onError={hideImg} /><span className="cap">Glazed partition · Five Dock</span></div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="blk services" id="services">
          <div className="wrap">
            <div className="head rv">
              <span className="eyebrow">Beyond simple consultancy</span>
              <h2 className="sec-title">Services as part <em>of design</em></h2>
              <p className="lead" style={{ marginTop: 16 }}>We oversee every phase with the same attention given to an architectural detail.</p>
            </div>
            <div className="svc-grid rv">
              {SERVICES.map((s) => (
                <div className="svc" key={s.no}><span className="no">{s.no}</span><div><h3>{s.t}</h3><p>{s.d}</p></div></div>
              ))}
            </div>
          </div>
        </section>

        {/* MATERIALS */}
        <section className="blk materials">
          <div className="wrap">
            <div className="mat-head rv">
              <span className="eyebrow">The palette</span>
              <h2 className="sec-title">Materials, chosen<br />for the <em>light</em></h2>
            </div>
            <div className="mat-row rv">
              {MATERIALS.map((m) => (
                <div className="mat" key={m.n}><div className="n">{m.n}</div><div className="d">{m.d}</div></div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="blk projects" id="projects">
          <div className="wrap">
            <div className="head rv">
              <h2>Recent work across <em>Sydney</em></h2>
              <p className="lead" style={{ maxWidth: '34ch' }}>A glimpse of installations in homes and commercial spaces.</p>
            </div>
            <div className="proj-grid">
              <div className="proj tall rv"><img className="photo" src={IMG.projA} alt="Cliffside villa" onError={hideImg} /><span className="badge">Residential</span><div className="meta"><div><div className="n">Cliffside Villa</div><div className="loc">Vaucluse</div></div></div></div>
              <div className="proj lead-p rv"><img className="photo" src={IMG.projB} alt="Harbour residence" onError={hideImg} /><span className="badge">Featured</span><div className="meta"><div><div className="n">Harbour Residence</div><div className="loc">Mosman</div></div><div className="price">Balustrade &amp; doors</div></div></div>
              <div className="proj tall rv"><img className="photo" src={IMG.projC} alt="Spa ensuite" onError={hideImg} /><span className="badge">Bathroom</span><div className="meta"><div><div className="n">Spa Ensuite</div><div className="loc">Inner West</div></div></div></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap">
            <div className="cta-inner rv">
              <img className="photo" src={IMG.cta} alt="Luminous glass interior" onError={hideImg} />
              <div className="in">
                <span className="eyebrow">Planning a renovation?</span>
                <h2>Let&apos;s shape your project<br />in <em>glass</em>.</h2>
                <p>Tell us about your space and we&apos;ll arrange a free on-site consultation and quote, anywhere across Sydney.</p>
                <a className="pill light" href="#contact">Book a free measure <Circ /></a>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="blk contact" id="contact">
          <div className="wrap contact-grid">
            <div className="rv">
              <span className="eyebrow">Get in touch</span>
              <h2>Let&apos;s make something <em>clear</em>.</h2>
              <p className="sub">Visit our Five Dock workshop or send your project details — we reply within one business day.</p>
              <div className="cinfo">
                <div className="row"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" /><circle cx="12" cy="11" r="2.4" /></svg></span><div><div className="k">Workshop</div><div className="v">Unit 2 / 24 Spencer St, Five Dock NSW 2046</div></div></div>
                <a href="tel:+61466126937"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5c0 9 6 15 15 15l-1-4-4-1-2 2c-2-1-4-3-5-5l2-2-1-4z" /></svg></span><div><div className="k">Phone</div><div className="v">0466 126 937</div></div></a>
                <a href="mailto:info@romanoglass.com.au"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></span><div><div className="k">Email</div><div className="v">info@romanoglass.com.au</div></div></a>
                <div className="row"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span><div><div className="k">Hours</div><div className="v">Mon–Fri 7–4 · Sat by appointment</div></div></div>
              </div>
            </div>
            <form
              className="card-form rv"
              onSubmit={(e) => {
                e.preventDefault()
                const note = e.currentTarget.querySelector('.form-note')
                if (note) note.textContent = 'Thank you — this is a design preview. On the live site this sends straight to info@romanoglass.com.au.'
              }}
            >
              <div className="fld row2"><div><label htmlFor="n">Name</label><input id="n" type="text" placeholder="Your name" required /></div><div><label htmlFor="p">Phone</label><input id="p" type="tel" placeholder="04xx xxx xxx" /></div></div>
              <div className="fld"><label htmlFor="e">Email</label><input id="e" type="email" placeholder="you@email.com" required /></div>
              <div className="fld"><label htmlFor="s">Project</label><select id="s"><option>Balcony balustrades</option><option>Internal glass doors</option><option>Frameless shower screen</option><option>Glass splashback</option><option>Staircase glazing</option><option>Bespoke / tailor-made</option></select></div>
              <div className="fld"><label htmlFor="m">Tell us about the space</label><textarea id="m" placeholder="Location, timeframe, any measurements you have…" /></div>
              <button className="pill solid" type="submit">Send enquiry <Circ /></button>
              <p className="form-note">We reply within one business day.</p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand"><span className="wm">Romano Glass</span><p>Bespoke architectural glass, drawn and made in Sydney since 2008.</p></div>
            <div className="foot-col"><h4>Solutions</h4><a href="#solutions">Balustrades</a><a href="#solutions">Glass doors</a><a href="#solutions">Shower screens</a><a href="#solutions">Splashbacks</a></div>
            <div className="foot-col"><h4>Studio</h4><a href="#services">Services</a><a href="#materials">Materials</a><a href="#craft">Who we are</a><a href="#projects">Projects</a></div>
            <div className="foot-col"><h4>Visit</h4><a href="#contact">Unit 2 / 24 Spencer St</a><a href="#contact">Five Dock, NSW 2046</a><a href="tel:+61466126937">0466 126 937</a><a href="mailto:info@romanoglass.com.au">info@romanoglass.com.au</a></div>
          </div>
          <div className="foot-bottom"><span>© 2026 Romano Glass. All rights reserved.</span><span>Architectural glazing · Sydney</span></div>
        </div>
      </footer>

      <a className="wa" href="#contact" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.45-.15-.64.15-.19.28-.73.94-.9 1.13-.16.19-.33.21-.62.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38 0 1.4 1.02 2.76 1.17 2.95.14.19 2.01 3.08 4.88 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2z" /></svg>
      </a>
    </div>
  )
}
