import { FormEvent, ReactNode, useEffect, useState } from "react"

import { useProjects } from "./useProjects"
import type { Project } from "./useProjects"

type Page = "home" | "about" | "services" | "projects" | "contact"
const img = {
  hero: "https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?auto=format&fit=crop&w=2200&q=88",
  intro:
    "https://images.unsplash.com/photo-1788834321919-6b336d3ab03e?auto=format&fit=crop&w=1400&q=85",
  dining:
    "https://images.unsplash.com/photo-1758448511421-debb41f3e621?auto=format&fit=crop&w=1400&q=85",
  kitchen:
    "https://images.unsplash.com/photo-1758565811352-a439bd6f956e?auto=format&fit=crop&w=1400&q=85",
  living:
    "https://images.unsplash.com/photo-1778731525357-25c95792c27c?auto=format&fit=crop&w=1400&q=85",
  lounge:
    "https://images.unsplash.com/photo-1758915753451-b478b4e6f920?auto=format&fit=crop&w=1400&q=85",
  stairs:
    "https://images.unsplash.com/photo-1783628500870-d5380cf2fa5e?auto=format&fit=crop&w=1400&q=85",
  detail:
    "https://images.unsplash.com/photo-1788546762508-449aec223c16?auto=format&fit=crop&w=1400&q=85",
  bath: "https://images.unsplash.com/photo-1763485956303-c9f7b5277173?auto=format&fit=crop&w=1400&q=85",
}
const services = [
  [
    "Residential Interior Design",
    "A considered, whole-home approach bringing layout, material, lighting and atmosphere into one clear direction.",
    img.hero,
  ],
  [
    "Living Room Design",
    "Welcoming living spaces shaped around comfort, conversation and the way your household spends time.",
    img.living,
  ],
  [
    "Bedroom Design",
    "Restful private spaces with balanced proportions, tactile finishes and a calm, personal point of view.",
    img.lounge,
  ],
  [
    "Kitchen Design",
    "Refined kitchens where practical planning, durable materials and clean visual lines work beautifully together.",
    img.kitchen,
  ],
  [
    "Flooring and Tiles",
    "Thoughtful surface selections that create continuity, character and an enduring interior foundation.",
    img.bath,
  ],
  [
    "Interior Finishing",
    "A cohesive layer of colour, texture, lighting and details that gives each room its final expression.",
    img.detail,
  ],
]
const exampleProjects: Project[] = [
  { id: "example-1", title: "Warm Minimal Living", category: "Living space concept", coverImage: img.hero, images: [img.hero], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-2", title: "Quiet Dining", category: "Dining space concept", coverImage: img.dining, images: [img.dining], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-3", title: "Sculpted Kitchen", category: "Kitchen concept", coverImage: img.kitchen, images: [img.kitchen], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-4", title: "Natural Layers", category: "Residential concept", coverImage: img.intro, images: [img.intro], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-5", title: "Soft Geometry", category: "Living space concept", coverImage: img.lounge, images: [img.lounge], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-6", title: "Open Rhythm", category: "Open-plan concept", coverImage: img.stairs, images: [img.stairs], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: true, isExample: true },
  { id: "example-7", title: "Material Study", category: "Interior detail concept", coverImage: img.detail, images: [img.detail], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: false, isExample: true },
  { id: "example-8", title: "Calm Retreat", category: "Bathroom concept", coverImage: img.bath, images: [img.bath], description: "Illustrative interior concept, not a completed Riaz Interiors project.", featured: false, isExample: true },
]
function Icon({
  close = false,
  menu = false,
}: {
  close?: boolean
  menu?: boolean
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={
          close
            ? "M6 6l12 12M18 6L6 18"
            : menu
              ? "M4 7h16M4 12h16M4 17h16"
              : "M5 12h13M13 6l6 6-6 6"
        }
      />
    </svg>
  )
}
function go(p: Page) {
  location.hash = p === "home" ? "#/" : `#/${p}`
  scrollTo({ top: 0, behavior: "smooth" })
}
function Btn({
  children,
  page,
  href,
  kind = "dark",
}: {
  children: ReactNode
  page?: Page
  href?: string
  kind?: string
}) {
  return (
    <a
      className={`btn ${kind}`}
      href={href ?? (page === "home" ? "#/" : `#/${page}`)}
      onClick={
        page
          ? (e) => {
              e.preventDefault()
              go(page)
            }
          : undefined
      }
    >
      <span>{children}</span>
      <Icon />
    </a>
  )
}
function Eye({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <p className={`eye ${light ? "light" : ""}`}>
      <i />
      {children}
    </p>
  )
}
function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false)
  const links: [string, Page][] = [
    ["Home", "home"],
    ["About Us", "about"],
    ["Services", "services"],
    ["Projects", "projects"],
    ["Contact", "contact"],
  ]
  return (
    <header>
      <a className="logo" href="#/" aria-label="Riaz Interiors Homepage">
        <img
          src="/riaz-interiors-website-logo.png"
          alt="Riaz Interiors"
          className="headerLogo"
        />
      </a>
      <nav className={open ? "open" : ""}>
        {links.map(([l, p]) => (
          <a
            className={p === page ? "active" : ""}
            key={p}
            href={p === "home" ? "#/" : `#/${p}`}
            onClick={() => setOpen(false)}
          >
            {l}
          </a>
        ))}
        <a className="navCta" href="#/contact">
          Get in touch
        </a>
      </nav>
      <button
        className="menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        <Icon close={open} menu={!open} />
      </button>
    </header>
  )
}
function Footer() {
  return (
    <footer>
      <div className="footGrid">
        <div>
          <a className="footerLogoLink" href="#/" aria-label="Riaz Interiors Homepage">
            <img
              src="/riaz-interiors-full-logo.png"
              alt="Riaz Interiors"
              className="footerLogo"
            />
          </a>
          <h3>
            YOUR HOME.
            <br />
            YOUR STYLE.
            <br />
            YOUR SPACE.
          </h3>
        </div>
        <div className="footCol">
          <b>Quick links</b>
          {["Home", "About Us", "Services", "Projects", "Contact"].map((x) => (
            <a
              key={x}
              href={
                x === "Home"
                  ? "#/"
                  : `#/${x === "About Us" ? "about" : x.toLowerCase()}`
              }
            >
              {x}
            </a>
          ))}
        </div>
        <div className="footCol">
          <b>Contact</b>
          <a href="tel:03002910316">03002910316</a>
          <a href="https://wa.me/923002910316">WhatsApp: +92 300 2910316</a>
          <p>Available to discuss residential interior projects.</p>
        </div>
      </div>
      <div className="copyright">
        <span>© 2026 Riaz Interiors. All rights reserved.</span>
        <span>Your dream home, our design.</span>
      </div>
    </footer>
  )
}
function Label() {
  return <span className="mediaLabel">Illustrative interior imagery</span>
}
function PageHero({
  kicker,
  title,
  text,
  image,
}: {
  kicker: string
  title: string
  text: string
  image: string
}) {
  return (
    <section className="pageHero">
      <div>
        <Eye>{kicker}</Eye>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <figure>
        <img src={image} alt="Illustrative luxury residential interior" />
        <Label />
      </figure>
    </section>
  )
}
function CTA() {
  return (
    <section className="cta">
      <Eye light>Begin a conversation</Eye>
      <h2>
        LET&apos;S CREATE A SPACE
        <br />
        <em>YOU&apos;LL LOVE.</em>
      </h2>
      <p>
        Have a home interior project in mind? Get in touch with Riaz Interiors
        and discuss your ideas.
      </p>
      <Btn page="contact" kind="gold">
        Start your project
      </Btn>
    </section>
  )
}
function Gallery({ limit }: { limit?: number }) {
  const { projects, loading, error, configured } = useProjects()
  const [selected, setSelected] = useState<Project | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  // Keep the original Figma concept cards only until a live API is configured.
  const source = configured ? projects : exampleProjects
  const visible = (limit ? source.filter((p) => p.featured).slice(0, limit) : source)
  return (
    <>
      {error && <p role="status">Unable to load projects right now. Please try again later.</p>}
      {loading && <p role="status">Loading projects…</p>}
      <div className="gallery">
        {visible.map((p, i) => (
          <article key={p.id}>
            <button className="projectImg" onClick={() => { setSelected(p); setImageIndex(0) }}>
              <img src={p.coverImage} alt={p.title} loading="lazy" />
              {p.isExample && <Label />}
              <span className="view">View {p.isExample ? "concept" : "project"} <Icon /></span>
            </button>
            <div className="projectInfo"><div><small>{p.category}</small><h3>{p.title}</h3></div><i>0{i + 1}</i></div>
          </article>
        ))}
      </div>
      {configured && !loading && !error && visible.length === 0 && <p>No published projects yet.</p>}
      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <button className="close" aria-label="Close project" onClick={() => setSelected(null)}><Icon close /></button>
            <img src={selected.images[imageIndex] ?? selected.coverImage} alt={`${selected.title} — photo ${imageIndex + 1}`} />
            <div>
              <Eye>{selected.isExample ? "Illustrative concept" : selected.category}</Eye>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              {selected.images.length > 1 && (
                <div className="projectPhotoControls">
                  <button type="button" onClick={() => setImageIndex(i => (i + selected.images.length - 1) % selected.images.length)}>Previous photo</button>
                  <span>{imageIndex + 1} / {selected.images.length}</span>
                  <button type="button" onClick={() => setImageIndex(i => (i + 1) % selected.images.length)}>Next photo</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
function Home() {
  return (
    <>
      <section className="hero">
        <img src={img.hero} alt="Illustrative warm modern living room" />
        <div className="shade" />
        <div className="heroText">
          <Eye light>Riaz Interiors · Residential Design</Eye>
          <h1>
            TRANSFORMING SPACES
            <br />
            INTO <em>BEAUTIFUL</em>
            <br />
            EXPERIENCES.
          </h1>
          <p>
            Thoughtfully designed interiors that bring elegance, comfort and
            personality into your home.
          </p>
          <div className="actions">
            <Btn page="projects" kind="gold">
              Explore our projects
            </Btn>
            <Btn page="contact" kind="lightBtn">
              Contact us
            </Btn>
          </div>
        </div>
        <small className="heroNote">
          Illustrative stock imagery — replace with approved project photography
        </small>
      </section>
      <section className="section intro">
        <div>
          <Eye>Our point of view</Eye>
          <h2>
            DESIGN THAT
            <br />
            FEELS <em>LIKE HOME.</em>
          </h2>
          <p>
            At Riaz Interiors, we believe every home deserves a unique identity.
            Our approach focuses on creating beautiful, comfortable and
            thoughtfully designed residential spaces.
          </p>
          <Btn page="about" kind="outline">
            Discover our approach
          </Btn>
        </div>
        <figure>
          <img
            src={img.intro}
            alt="Illustrative neutral living room"
            loading="lazy"
          />
          <Label />
        </figure>
      </section>
      <section className="section works">
        <Heading
          eye="Portfolio preview"
          title={
            <>
              SELECTED <em>WORKS</em>
            </>
          }
          text="Explore a selection of our residential interior projects."
        />
        <Gallery limit={6} />
      </section>
      <section className="expertise">
        <div className="section">
          <Heading
            eye="What we do"
            title={
              <>
                OUR <em>EXPERTISE</em>
              </>
            }
            text="From a single room to a connected home, services are shaped around comfortable residential living."
          />
          <div className="serviceLines">
            {services.map((s, i) => (
              <a href="#/services" key={s[0]}>
                <i>0{i + 1}</i>
                <h3>{s[0]}</h3>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section why">
        <div>
          <Eye>Our values</Eye>
          <h2>
            WHY RIAZ
            <br />
            <em>INTERIORS?</em>
          </h2>
        </div>
        <div className="valueGrid">
          {[
            [
              "Thoughtful Design",
              "Every decision begins with how the space should feel and function.",
            ],
            [
              "Attention to Detail",
              "Materials, proportions and finishing touches form one cohesive whole.",
            ],
            [
              "Functional Spaces",
              "Visual calm meets practical choices that support daily life.",
            ],
            [
              "Personal Approach",
              "Your preferences guide a direction made to feel distinctly yours.",
            ],
          ].map((x, i) => (
            <article key={x[0]}>
              <i>0{i + 1}</i>
              <h3>{x[0]}</h3>
              <p>{x[1]}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  )
}
function Heading({
  eye,
  title,
  text,
}: {
  eye: string
  title: ReactNode
  text: string
}) {
  return (
    <div className="heading">
      <div>
        <Eye>{eye}</Eye>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </div>
  )
}
function About() {
  return (
    <>
      <PageHero
        kicker="About Riaz Interiors"
        title="THE STORY BEHIND RIAZ INTERIORS"
        text="A residential interior design business focused on creating beautiful and functional living spaces."
        image={img.stairs}
      />
      <section className="section story">
        <div>
          <Eye>Our philosophy</Eye>
          <h2>
            A HOME SHOULD
            <br />
            FEEL <em>PERSONAL.</em>
          </h2>
        </div>
        <div>
          <strong>
            Riaz Interiors is focused on creating beautiful and functional
            living spaces.
          </strong>
          <p>
            We believe a thoughtfully designed home should reflect the
            personality, comfort and lifestyle of the people who live in it.
          </p>
          <p>
            Our approach begins by listening. We consider flow, natural light,
            materials and details, bringing them together with quiet confidence.
          </p>
        </div>
      </section>
      <section className="manifesto">
        <img src={img.detail} alt="Illustrative interior details" />
        <div>
          <Eye light>How we think</Eye>
          <h2>
            “BEAUTY IS MOST POWERFUL WHEN EVERYDAY LIFE FEELS EFFORTLESS.”
          </h2>
          <p>
            Spaces are planned for living first, then refined through
            proportion, texture and visual calm.
          </p>
        </div>
        <Label />
      </section>
      <section className="section approach">
        <Eye>Our approach</Eye>
        <div>
          {[
            [
              "01",
              "Listen",
              "Understand your space, priorities, taste and everyday rhythms.",
            ],
            [
              "02",
              "Shape",
              "Develop a cohesive direction for layout, materials and atmosphere.",
            ],
            [
              "03",
              "Refine",
              "Bring details together so each room feels resolved and personal.",
            ],
          ].map((x) => (
            <article key={x[1]}>
              <i>{x[0]}</i>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  )
}
function Services() {
  return (
    <>
      <PageHero
        kicker="What we offer"
        title="OUR SERVICES"
        text="Explore interior design possibilities for your home, from complete direction to considered room and finish selections."
        image={img.kitchen}
      />
      <section className="section serviceList">
        {services.map((s, i) => (
          <article className={i % 2 ? "reverse" : ""} key={s[0]}>
            <figure>
              <img src={s[2]} alt={`Illustrative ${s[0]}`} loading="lazy" />
              <Label />
            </figure>
            <div>
              <i>0{i + 1}</i>
              <h2>{s[0]}</h2>
              <p>{s[1]}</p>
              <Btn page="contact" kind="outline">
                Discuss this service
              </Btn>
            </div>
          </article>
        ))}
      </section>
      <CTA />
    </>
  )
}
function Projects() {
  return (
    <>
      <PageHero
        kicker="Residential portfolio"
        title="OUR PROJECT PORTFOLIO"
        text="Explore our residential interior projects and design concepts."
        image={img.living}
      />
      <section className="section portfolio">
        <div className="notice">
          <b>Media note</b>
          <p>
            Until real projects are published, this gallery shows illustrative concepts.
            Published project photography will appear automatically.
          </p>
        </div>
        <Gallery />
      </section>
      <CTA />
    </>
  )
}
function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [whatsAppUrl, setWhatsAppUrl] = useState("https://wa.me/923002910316")
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = new FormData(form)
    const message = [
      "Hello Riaz Interiors, I would like to discuss a project.",
      `Name: ${fields.get("name")}`,
      `Phone: ${fields.get("phone")}`,
      `Email: ${fields.get("email") || "Not provided"}`,
      `Service: ${fields.get("service")}`,
      `Message: ${fields.get("message")}`,
    ].join("\n")
    setWhatsAppUrl(`https://wa.me/923002910316?text=${encodeURIComponent(message)}`)
    if (!endpoint) {
      setStatus("error")
      return
    }
    setStatus("sending")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: fields,
        headers: { Accept: "application/json" },
      })
      if (!response.ok) throw new Error("Email delivery request failed")
      setStatus("sent")
      form.reset()
    } catch {
      setStatus("error")
    }
  }
  return (
    <>
      <section className="contactHero">
        <div>
          <Eye>Contact Riaz Interiors</Eye>
          <h1>
            LET&apos;S TALK ABOUT
            <br />
            <em>YOUR PROJECT.</em>
          </h1>
          <p>
            Have an idea for your home? Contact Riaz Interiors to discuss your
            requirements.
          </p>
          <div className="actions">
            <Btn href="tel:03002910316">Call now</Btn>
            <Btn href="https://wa.me/923002910316" kind="gold">
              WhatsApp
            </Btn>
          </div>
          <div className="direct">
            <div>
              <small>Business</small>
              <b>Riaz Interiors</b>
            </div>
            <div>
              <small>Phone</small>
              <a href="tel:03002910316">03002910316</a>
            </div>
          </div>
        </div>
        <figure>
          <img src={img.dining} alt="Illustrative warm dining room" />
          <Label />
        </figure>
      </section>
      <section className="inquiry">
        <div>
          <Eye>Project inquiry</Eye>
          <h2>
            TELL US ABOUT
            <br />
            <em>YOUR SPACE.</em>
          </h2>
          <p>
            Share a few details below to discuss your residential interior project.
          </p>
        </div>
        <form onSubmit={submit}>
          <Field label="Full Name *">
            <input name="name" required placeholder="Your full name" />
          </Field>
          <Field label="Phone Number *">
            <input name="phone" required type="tel" placeholder="Your phone number" />
          </Field>
          <Field label="Email Address (optional)">
            <input name="email" type="email" placeholder="Your email address" />
          </Field>
          <label>
            <span>Project Type *</span>
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s[0]}>{s[0]}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            <span>Message *</span>
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Tell us about your home and what you have in mind"
            />
          </label>
          <button className="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send inquiry"} <Icon />
          </button>
          <p className="formNote">
            Email delivery requires the configured inquiry service. WhatsApp is also available.
          </p>
          {(status === "sent" || status === "error") && (
            <div className="formMsg" role="status">
              <b>{status === "sent" ? "Your email inquiry was submitted." : "Your email inquiry was not sent."}</b>
              <p>{status === "sent"
                ? "You can also share your project details with us on WhatsApp."
                : "Please use WhatsApp to send your project details directly."}</p>
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                Continue to WhatsApp <Icon />
              </a>
            </div>
          )}
        </form>
      </section>
    </>
  )
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  )
}
export default function App() {
  const [page, setPage] = useState<Page>("home")
  useEffect(() => {
    const update = () => {
      const x = location.hash.replace("#/", "") as Page
      const p = (
        ["about", "services", "projects", "contact"].includes(x) ? x : "home"
      ) as Page
      setPage(p)
      document.title = `${
        p === "home"
          ? "Riaz Interiors | Residential Interior Design"
          : p[0].toUpperCase() + p.slice(1) + " | Riaz Interiors"
      }`
    }
    update()
    addEventListener("hashchange", update)
    return () => removeEventListener("hashchange", update)
  }, [])
  return (
    <>
      <Header page={page} />
      <main>
        {page === "home" ? (
          <Home />
        ) : page === "about" ? (
          <About />
        ) : page === "services" ? (
          <Services />
        ) : page === "projects" ? (
          <Projects />
        ) : (
          <Contact />
        )}
      </main>
      <Footer />
    </>
  )
}
