# LinkedIn Profile Sync Setup

## 1. Crear aplicación en LinkedIn Developer Portal

1. Ve a https://developer.linkedin.com/
2. Inicia sesión con tu cuenta de LinkedIn
3. Ve a "My Apps" → "Create App"
4. Completa:
   - App Name: "Portfolio Personal"
   - LinkedIn Page: (tu página personal si tienes, o déjalo vacío)
   - Privacy Policy URL: (URL de tu portfolio)
   - Terms of Use URL: (URL de tu portfolio)

5. En Auth → Auth 2.0 Settings, añade:
   - Authorized Redirect URLs: `http://localhost:3000/auth/callback`

6. Anota:
   - **Client ID**
   - **Client Secret**

## 2. Obtener Access Token

### Opción A: OAuth 2.0 Manual (Recomendado para one-time)
```bash
# Genera la URL de autorización (reemplaza CLIENT_ID)
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=TU_CLIENT_ID&redirect_uri=http://localhost:3000/auth/callback&scope=r_liteprofile%20r_basicprofile%20r_emailaddress
```

1. Abre esa URL en tu navegador
2. Autoriza la aplicación
3. Copia el `code` de la URL de redirección
4. Intercambia el code por token:

```bash
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d grant_type=authorization_code \
  -d code=CODIGO_COPIADO \
  -d redirect_uri=http://localhost:3000/auth/callback \
  -d client_id=TU_CLIENT_ID \
  -d client_secret=TU_CLIENT_SECRET
```

5. Guarda el `access_token` (válido por ~60 días)

### Opción B: OAuth 2.0 con Refresh Token (Para automatizar)
El refresh token permite obtener nuevos access tokens automáticamente.

## 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
LINKEDIN_ACCESS_TOKEN=tu_token_aqui
```

**NO subas este archivo a git** (ya está en .gitignore por defecto).

## 4. Sincronizar datos

```bash
# Instala dependencia para leer .env
npm install dotenv --save-dev

# Ejecuta el sync
npm run sync:linkedin

# O incluyelo en el build
npm run build
```

## Permisos disponibles (Community Tier)

- `r_liteprofile`: Nombre, foto, ID (siempre disponible)
- `r_basicprofile`: Headline, ubicación, URL pública (requiere aprobación)
- `r_emailaddress`: Email del usuario

Para tu portfolio personal, con `r_liteprofile` + `r_basicprofile` tendrás:
- Nombre completo
- Foto de perfil
- Headline / Título profesional
- Ubicación
- URL personalizada
