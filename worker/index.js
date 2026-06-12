// Cloudflare Worker — proxy entre el frontend del portfolio y Groq.
// La API key de Groq vive aquí (como secret del Worker), NUNCA en el navegador.
// El frontend solo envía { messages: [{ role, text }] }.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

// Orígenes autorizados a usar el proxy (evita que otras webs gasten tu cuota).
const ALLOWED_ORIGINS = [
  'https://angelsospedra.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]

const SYSTEM_PROMPT = `
You are an AI assistant embedded in Ángel Sospedra Martínez's portfolio website.
Your only job is to answer visitors' questions about Ángel's professional profile.
Use ONLY the information below. Do NOT invent or assume anything outside this data.
Reply in the same language the visitor uses. Be friendly, concise, and professional.
If a question is not covered by this data, say Ángel can answer it directly via the contact form at the bottom of the page.

--- PROFILE ---
Name: Ángel Sospedra Martínez
Role: Frontend Developer
Location: Valencia, Spain

--- BIO ---
Frontend Developer from Valencia with professional experience building websites for marketplaces.
Passionate about fast, clean, user-centered interfaces.
Also works closely with AI: prepares technical context and documentation, and collaborates with AI models to implement solutions faster and more precisely.

--- TECH SKILLS ---
Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Angular, Tailwind CSS, Bootstrap, Vite
Tools: Git, GitHub, GitLab, Fork, Figma, Azure, Photoshop, DaVinci Resolve, Slack, Teams, Notion, Jira
3D / Creative: Three.js, Maya, ZBrush, Substance Painter, Unity, Unreal Engine, Vuforia (AR)

--- PROJECTS ---
1. VP — Multi-tenant marketplace for car part dealers
   Stack: React, Next.js, TypeScript, Tailwind CSS, SSR/SSG
   Features: per-tenant user management, product/parts catalog, full checkout with order system, payment gateway integration

2. Proyecto Vivir PWA — PWA for an NGO supporting women at risk of social exclusion
   Stack: React, Vite, PWA, Firebase
   Features: collaborative document management, volunteer & beneficiary coordination, centralised mobile communication

3. Fitmap — Sports-directory PWA to find courts and sport facilities
   Stack: PWA, JavaScript, PHP, MySQL
   Features: user registration & management, search/filter sports spaces, court booking

4. Vinilocos — Marketplace for buying/selling second-hand vinyl records
   Stack: HTML, CSS, JavaScript, PHP, MySQL
   Features: admin panel, catalog & order management, customer area for purchases and tracking

--- EDUCATION ---
2016–2018  TSMR (Microcomputer Systems and Networks) — La Florida, Catarroja, Valencia
2018–2020  Higher Degree in 3D Animation — Progresa, Valencia
2021       Master's in 3D Art for Video Games — La Florida, Catarroja, Valencia
2024–2026  Higher Degree in DAW (Web Application Development) — Cámara FP, Paterna, Valencia

--- WORK EXPERIENCE ---
2019        Grupo Ceremón (Valencia) — VR with Unreal Engine, AR with Vuforia, 3D asset modeling in Maya
2021–2023   Polygonal Mind (Zaragoza) — 3D environments & assets (Maya, ZBrush, Substance Painter), Unity integration with LODs, international client management
2025        StartGo Connection (Valencia, remote) — Corporate website layouts with HTML/CSS/JS, WordPress development
2026        Conmuta Soluciones (Paterna, Valencia) — Frontend of a marketplace e-commerce with React, Next.js, TypeScript, Tailwind CSS, SSR/SSG

--- CONTACT & LINKS ---
Contact form: available at the bottom of the portfolio page
GitHub: https://github.com/Angelsospedra
LinkedIn: https://www.linkedin.com/in/angel-sospedra/
ArtStation: https://www.artstation.com/angelsospedra
`.trim()

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  }
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors })
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors)
    }
    if (!env.GROQ_API_KEY) {
      return json({ error: 'GROQ_API_KEY not configured' }, 500, cors)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors)
    }

    const messages = Array.isArray(body?.messages) ? body.messages : null
    if (!messages) {
      return json({ error: 'messages array required' }, 400, cors)
    }

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: String(m.text ?? ''),
          })),
        ],
      }),
    })

    // Reenvía la respuesta de Groq tal cual (el frontend lee choices[0].message.content).
    const text = await groqRes.text()
    return new Response(text, {
      status: groqRes.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  },
}
