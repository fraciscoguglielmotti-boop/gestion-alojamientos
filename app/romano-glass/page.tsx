'use client'

import { useEffect, useRef } from 'react'

/* Unsplash imagery — falls back to the tile's glass gradient if a photo
   fails to load, so the layout never looks broken offline. Swap these for
   Romano Glass's own professional photography in production. */
const IMG = {
  hero: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=70',
  heritage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70',
  shower: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=70',
  splash: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=70',
  mirror: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=70',
  balustrade: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=70',
  pool: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=70',
}

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function RomanoGlassPage() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // header shadow
    const header = root.querySelector('header')
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // reveal
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
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    // caustics canvases
    const hexA = (hex: string, a: number) => {
      let h = hex.replace('#', '')
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
      const n = parseInt(h, 16)
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
    }
    const PAL: Record<string, string[]> = {
      caustics: ['#1C9B84', '#0F6E5C', '#2ec9ac'],
      cta: ['#25b79e', '#0a3a32', '#8bf0dd'],
    }
    type Field = { draw: (t: number) => void; refit: () => void }
    const fields: Field[] = []

    const build = (
      canvas: HTMLCanvasElement,
      key: string,
      opts: { count: number; alpha: number; scale: number; lines?: number }
    ): Field => {
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const r = canvas.getBoundingClientRect()
        canvas.width = Math.max(1, Math.round(r.width * dpr))
        canvas.height = Math.max(1, Math.round(r.height * dpr))
        const ctx = canvas.getContext('2d')!
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        return { ctx, w: r.width, h: r.height }
      }
      let s = fit()
      const pal = PAL[key] || PAL.caustics
      const seeds = Array.from({ length: opts.count }, (_, i) => ({
        x: ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1,
        y: ((Math.sin(i * 78.233) * 12543.987) % 1 + 1) % 1,
        r: 0.28 + (Math.sin(i * 3.17) * 0.5 + 0.5) * 0.4,
        c: pal[i % pal.length],
        px: 0.15 + 0.2 * Math.sin(i * 2.1),
        py: 0.12 + 0.18 * Math.cos(i * 1.7),
        sp: 0.18 + 0.12 * (i % 3),
      }))
      const draw = (t: number) => {
        const { ctx, w: W, h: H } = s
        ctx.clearRect(0, 0, W, H)
        ctx.globalCompositeOperation = 'lighter'
        seeds.forEach((sd, i) => {
          const cx = (sd.x + sd.px * Math.sin(t * sd.sp + i)) * W
          const cy = (sd.y + sd.py * Math.cos(t * sd.sp * 0.9 + i * 1.3)) * H
          const rad = sd.r * Math.max(W, H) * opts.scale
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
          g.addColorStop(0, hexA(sd.c, opts.alpha))
          g.addColorStop(1, hexA(sd.c, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(cx, cy, rad, 0, 6.2832)
          ctx.fill()
        })
        ctx.globalCompositeOperation = 'source-over'
        if (opts.lines) {
          ctx.globalCompositeOperation = 'screen'
          for (let k = 0; k < opts.lines; k++) {
            const off = (k / opts.lines) * W + Math.sin(t * 0.4 + k) * 30
            ctx.strokeStyle = hexA(pal[2], 0.1)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(off, 0)
            ctx.lineTo(off + W * 0.4, H)
            ctx.stroke()
          }
          ctx.globalCompositeOperation = 'source-over'
        }
      }
      return { draw, refit: () => { s = fit() } }
    }

    const cau = root.querySelector<HTMLCanvasElement>('#caustics')
    if (cau) fields.push(build(cau, 'caustics', { count: 5, alpha: 0.16, scale: 1.1, lines: 5 }))
    const cta = root.querySelector<HTMLCanvasElement>('#cta-art')
    if (cta) fields.push(build(cta, 'cta', { count: 6, alpha: 0.4, scale: 1, lines: 6 }))

    let raf = 0
    let t = 0
    const frame = () => {
      t += 0.006
      fields.forEach((f) => f.draw(t))
      raf = requestAnimationFrame(frame)
    }
    if (reduce) {
      t = 2
      fields.forEach((f) => f.draw(t))
    } else {
      raf = requestAnimationFrame(frame)
    }

    let rt: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(() => {
        fields.forEach((f) => f.refit())
        if (reduce) fields.forEach((f) => f.draw(t))
      }, 160)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      io.disconnect()
      cancelAnimationFrame(raf)
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
          <a className="brand" href="#top" aria-label="Romano Glass home">
            <svg className="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="32" height="32" rx="3" stroke="var(--accent)" strokeWidth="1.6" />
              <path d="M4 20 H36 M20 4 V36" stroke="var(--accent)" strokeWidth="1.1" opacity=".55" />
              <path d="M8 32 L32 8" stroke="var(--accent)" strokeWidth="1.1" opacity=".8" />
              <circle cx="20" cy="20" r="3.2" fill="var(--accent)" />
            </svg>
            <span className="name">
              Romano Glass
              <span>Architectural Glazing · Sydney</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#heritage">Our Craft</a>
            <a href="#gallery">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="nav-cta" href="#contact">Get a quote</a>
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle light and dark theme" title="Toggle theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M19 5l-1.7 1.7M6.7 17.3 5 19M19 19l-1.7-1.7M6.7 6.7 5 5" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <canvas id="caustics" aria-hidden="true" />
          <div className="wrap">
            <div className="hero-grid">
              <div className="hero-copy reveal">
                <span className="eyebrow">Bespoke Architectural Glass · Sydney since 2008</span>
                <h1>Glass, crafted with <em>Italian</em> precision.</h1>
                <p className="lede">
                  Frameless shower screens, splashbacks, balustrades and bespoke glazing — designed,
                  fabricated and installed to a standard you can see at every edge.
                </p>
                <div className="cta-row">
                  <a className="btn btn-primary" href="#contact">Request a consultation <Arrow /></a>
                  <a className="btn btn-ghost" href="#gallery">View our work</a>
                </div>
                <div className="hero-stats">
                  <div><div className="n">2008</div><div className="l">Established in Sydney</div></div>
                  <div><div className="n">25+</div><div className="l">Years of craftsmanship</div></div>
                  <div><div className="n">100%</div><div className="l">Custom measured &amp; made</div></div>
                </div>
              </div>
              <div className="hero-visual reveal">
                <div className="glass-panel">
                  <div className="glass-inner">
                    <img className="photo" src={IMG.hero} alt="Frameless glass shower screen installation" loading="eager" onError={hideOnError} />
                    <div className="sheen" />
                    <div className="panel-tag">
                      <span><b>Frameless shower screen</b>Low-iron · polished edges</span>
                      <span className="badge">Five Dock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <div className="trust">
          <div className="wrap">
            <div className="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>Fully insured &amp; licensed</div>
            <div className="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" /><circle cx="12" cy="11" r="2.4" /></svg>Sydney-wide service</div>
            <div className="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M6 21V9l6-5 6 5v12" /><path d="M10 21v-5h4v5" /></svg>Residential &amp; commercial</div>
            <div className="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M4 6l8 4 8-4" /></svg>Italian-trained glaziers</div>
            <div className="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>On-time installation</div>
          </div>
        </div>

        {/* SERVICES */}
        <section className="block services" id="services">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">What we make</span>
              <h2>A full range of architectural glass, made to measure.</h2>
              <p>From the everyday to the exceptional — each piece cut, polished and toughened for your space, then installed by the same hands that measured it.</p>
            </div>
            <div className="svc-grid">
              {[
                { t: 'Frameless Shower Screens', d: 'Ultra-clear low-iron panels with polished edges and premium hardware — the centrepiece of a modern bathroom.', p: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M14 3v18M4 9h10" /><circle cx="16.5" cy="12" r="1" /></> },
                { t: 'Glass Splashbacks', d: 'Seamless, hygienic and colour-matched to your kitchen — toughened glass in any shade, cut around every outlet.', p: <><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M3 16h18M7 20h10" /><path d="M7 8l3 3 4-5" /></> },
                { t: 'Mirrors & Wardrobes', d: 'Bespoke mirrors, antique finishes and sliding wardrobe doors — cut to size to open up and light any room.', p: <><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M9 6c1.5 1 4.5 1 6 0" /></> },
                { t: 'Balustrades & Stairs', d: 'Frameless and channel-fixed balustrades for balconies, stairs and voids — structural safety with an invisible line.', p: <><path d="M4 20V8M20 20V8M4 20h16M4 8h16" /><path d="M8 8v12M12 8v12M16 8v12M4 8l8-4 8 4" /></> },
                { t: 'Glass Pool Fencing', d: 'Frameless pool fencing that meets Australian safety standards without blocking the view of the water.', p: <><path d="M5 21V7M11 21V7M17 21V7M3 21h18" /><path d="M4 7l7-4 7 4" /><path d="M8 12h.01M14 12h.01" /></> },
                { t: 'Curved & Patterned Glass', d: 'Bent, textured and decorative glass for feature walls, staircases and one-off architectural pieces.', p: <><path d="M4 18c0-8 5-12 16-12" /><path d="M4 18h16" /><path d="M4 18v3M20 6v12" /></> },
              ].map((s) => (
                <article className="svc reveal" key={s.t}>
                  <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{s.p}</svg></div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="more">Explore <Arrow /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE */}
        <section className="block heritage" id="heritage">
          <div className="wrap">
            <div className="heritage-grid">
              <div className="heritage-visual reveal">
                <img className="photo" src={IMG.heritage} alt="Frameless glass balustrade on a modern staircase" onError={hideOnError} />
                <div className="stamp">Est. 2008<span>Five Dock · NSW</span></div>
              </div>
              <div className="heritage-copy reveal">
                <span className="eyebrow">Our craft</span>
                <h2>A family name built on the edge of every pane.</h2>
                <div className="body">
                  <p>Romano Glass was founded in Sydney in 2008, bringing an Italian glazier&apos;s eye to Australian homes and projects. More than a quarter of a century at the trade means we read a space before we cut a single sheet.</p>
                  <p>We keep the whole process under one roof — consultation, laser-precise measurement, fabrication and installation — so nothing is lost in translation between the drawing and the finished edge. The result is glass that fits the first time and looks right for decades.</p>
                </div>
                <div className="stat-row">
                  <div className="stat"><div className="n">15+</div><div className="l">Years serving Sydney</div></div>
                  <div className="stat"><div className="n">1,200+</div><div className="l">Projects installed</div></div>
                  <div className="stat"><div className="n">5.0</div><div className="l">Average client rating</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="block process" id="process">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">How we work</span>
              <h2>Four steps, one team, no surprises.</h2>
            </div>
            <div className="steps">
              {[
                { n: '01', t: 'Consult', d: 'We visit your site, understand the brief and advise on glass type, thickness and hardware.' },
                { n: '02', t: 'Measure & design', d: 'Precise on-site measurement and a clear quote — no templates, no guesswork.' },
                { n: '03', t: 'Fabricate', d: 'Cut, toughened and edge-polished to spec, ready for a flawless fit.' },
                { n: '04', t: 'Install', d: 'Clean, careful installation by the same glaziers who measured — finished on time.' },
              ].map((s) => (
                <div className="step reveal" key={s.n}>
                  <div className="num">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="block gallery" id="gallery">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow">Selected work</span>
              <h2>Where light meets craftsmanship.</h2>
              <p>A glimpse of recent installations across Sydney homes and commercial spaces.</p>
            </div>
            <div className="gal-grid">
              <div className="tile big reveal">
                <img className="photo" src={IMG.shower} alt="Frameless shower screen" onError={hideOnError} />
                <div className="cap"><span>Bathroom</span><b>Frameless shower screen</b></div>
              </div>
              <div className="tile reg reveal">
                <img className="photo" src={IMG.splash} alt="Coloured glass splashback" onError={hideOnError} />
                <div className="cap"><span>Kitchen</span><b>Coloured splashback</b></div>
              </div>
              <div className="tile reg reveal">
                <img className="photo" src={IMG.mirror} alt="Feature mirror wall" onError={hideOnError} />
                <div className="cap"><span>Interior</span><b>Feature mirror wall</b></div>
              </div>
              <div className="tile wide reveal">
                <img className="photo" src={IMG.balustrade} alt="Frameless glass balustrade" onError={hideOnError} />
                <div className="cap"><span>Staircase</span><b>Frameless balustrade</b></div>
              </div>
              <div className="tile wide reveal">
                <img className="photo" src={IMG.pool} alt="Glass pool fence" onError={hideOnError} />
                <div className="cap"><span>Outdoor</span><b>Glass pool fence</b></div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="block quote">
          <div className="wrap reveal">
            <div className="stars">★★★★★</div>
            <blockquote>&ldquo;The finish is flawless. Claudio measured everything himself and the shower screen fits like it was poured into the space. Genuinely the best trade we dealt with on our renovation.&rdquo;</blockquote>
            <div className="who"><b>Elena &amp; Marco D.</b> — Home renovation, Inner West Sydney</div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-band">
          <canvas id="cta-art" aria-hidden="true" />
          <div className="wrap reveal">
            <span className="eyebrow">Planning a renovation?</span>
            <h2>Let&apos;s talk glass.</h2>
            <p>Tell us about your project and we&apos;ll arrange a free on-site consultation and quote, anywhere across Sydney.</p>
            <a className="btn btn-primary" href="#contact">Book your free measure &amp; quote <Arrow /></a>
          </div>
        </section>

        {/* CONTACT */}
        <section className="block contact" id="contact">
          <div className="wrap">
            <div className="contact-grid">
              <div className="contact-info reveal">
                <span className="eyebrow">Get in touch</span>
                <h2>Let&apos;s make something clear.</h2>
                <p>Visit our Five Dock workshop or send us your project details — we&apos;ll get back to you within one business day.</p>
                <div className="info-list">
                  <div className="info-item"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" /><circle cx="12" cy="11" r="2.4" /></svg></div><div><div className="t">Workshop</div><div className="v">Unit 2 / 24 Spencer St, Five Dock, NSW 2046</div></div></div>
                  <div className="info-item"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5c0 9 6 15 15 15l-1-4-4-1-2 2c-2-1-4-3-5-5l2-2-1-4z" /></svg></div><div><div className="t">Phone</div><a className="v" href="tel:+61466126937">0466 126 937</a></div></div>
                  <div className="info-item"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></div><div><div className="t">Email</div><a className="v" href="mailto:info@romanoglass.com.au">info@romanoglass.com.au</a></div></div>
                  <div className="info-item"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div><div><div className="t">Hours</div><div className="v">Mon–Fri 7am–4pm · Sat by appointment</div></div></div>
                </div>
              </div>
              <form
                className="card reveal"
                onSubmit={(e) => {
                  e.preventDefault()
                  const note = e.currentTarget.querySelector('.form-note')
                  if (note) note.textContent = 'Thanks — this is a design preview. In the live site this sends straight to info@romanoglass.com.au.'
                }}
              >
                <div className="field row">
                  <div><label htmlFor="n">Name</label><input id="n" type="text" placeholder="Your name" required /></div>
                  <div><label htmlFor="p">Phone</label><input id="p" type="tel" placeholder="04xx xxx xxx" /></div>
                </div>
                <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" placeholder="you@email.com" required /></div>
                <div className="field">
                  <label htmlFor="s">Project type</label>
                  <select id="s">
                    <option>Frameless shower screen</option>
                    <option>Glass splashback</option>
                    <option>Mirror / wardrobe</option>
                    <option>Balustrade / stairs</option>
                    <option>Glass pool fencing</option>
                    <option>Curved / patterned glass</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div className="field"><label htmlFor="m">Project details</label><textarea id="m" placeholder="Tell us about your space, timeframe and any measurements you have…" /></div>
                <button className="btn btn-primary" type="submit">Send enquiry
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
                </button>
                <p className="form-note">We reply within one business day.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="name">Romano Glass</div>
              <p>Bespoke architectural glass, designed and installed across Sydney since 2008.</p>
            </div>
            <div className="foot-col">
              <h4>Services</h4>
              <a href="#services">Shower screens</a>
              <a href="#services">Splashbacks</a>
              <a href="#services">Mirrors</a>
              <a href="#services">Balustrades</a>
              <a href="#services">Pool fencing</a>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <a href="#heritage">Our craft</a>
              <a href="#gallery">Our work</a>
              <a href="#process">Process</a>
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
            <div>© 2026 Romano Glass. All rights reserved.</div>
            <div className="socials">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2.5C18.5 2.4 17 2 15.5 2 12.5 2 11 3.8 11 7v3H8v4h3v8z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3zM5 10h3v9H5zM10 10h3v1.3c.5-.9 1.6-1.5 2.9-1.5 2.3 0 3.1 1.4 3.1 3.7V19h-3v-4.5c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8V19h-3z" /></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
