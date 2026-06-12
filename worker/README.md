# Portfolio Chat Worker

Proxy serverless (Cloudflare Worker) entre el frontend del portfolio y la API de
Groq. Su único objetivo: **que la API key de Groq nunca llegue al navegador**.

El frontend hace `POST { messages }` al Worker; el Worker añade la key (guardada
como *secret*), el modelo y el system prompt, llama a Groq y devuelve la respuesta.

## Despliegue (una sola vez)

Desde la carpeta `worker/`:

```bash
cd worker

# 1. Iniciar sesión en Cloudflare (abre el navegador). Crea cuenta gratis si no tienes.
npx wrangler login

# 2. Guardar la API key de Groq como secret del Worker (NO en el código).
#    Pega la key cuando la pida. Genera una nueva en https://console.groq.com/keys
npx wrangler secret put GROQ_API_KEY

# 3. Desplegar
npx wrangler deploy
```

Al terminar, `wrangler` imprime la URL del Worker, algo como:

```
https://portfolio-chat.<tu-subdominio>.workers.dev
```

## Conectar el frontend

Pon esa URL en:

1. **Local** — `.env.local` del proyecto:
   ```
   VITE_CHAT_API_URL=https://portfolio-chat.<tu-subdominio>.workers.dev
   ```
   y reinicia `npm run dev`.

2. **Producción** — GitHub → *Settings → Secrets and variables → Actions* →
   nuevo secret `VITE_CHAT_API_URL` con la misma URL.

## Desarrollo local del Worker (opcional)

```bash
cd worker
npx wrangler dev        # sirve en http://localhost:8787
```

Para usarlo en local pon `VITE_CHAT_API_URL=http://localhost:8787` en `.env.local`.

## CORS

Los orígenes permitidos están en `index.js` (`ALLOWED_ORIGINS`). Si cambias el
dominio del portfolio (p. ej. dominio propio), añádelo ahí y vuelve a desplegar.
