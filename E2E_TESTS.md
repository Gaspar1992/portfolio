# Tests E2E (End-to-End)

Este documento explica cómo ejecutar las pruebas E2E del portfolio, que están diseñadas para verificar el funcionamiento completo de la aplicación desde el punto de vista del usuario.

## 🚀 Ejecución Rápida

### Para desarrollo y debugging:
```bash
# Ejecutar todos los tests e2e
npm run test:e2e

# Interfaz gráfica para ver los tests en tiempo real
npm run test:e2e:ui

# Modo debug para inspeccionar paso a paso
npm run test:e2e:debug
```

### Para CI/CD (automatizado):
```bash
# Ejecutar solo en Chromium (más rápido para CI)
npm run test:e2e:ci
```

## 📋 Flujo de Deploy

Los tests E2E **NO** están incluidos en el flujo principal de deploy. El flujo actual es:

```bash
# Pre-deploy (solo tests unitarios y linting)
npm run predeploy

# Deploy completo (incluye Lighthouse)
npm run deploy:check
```

## 🧪 Estructura de los Tests

Los tests están organizados en tres categorías:

### 1. Tests de Accesibilidad (`e2e/tests/accessibility.spec.ts`)
- Verifica WCAG compliance
- Tests de lectura por pantalla
- Navegación por teclado
- Estructura semántica HTML

### 2. Tests de Navegación (`e2e/tests/navigation.spec.ts`)
- Carga de secciones
- Navegación entre páginas
- Links de contacto
- Contenido del footer

### 3. Tests de Diseño Responsivo (`e2e/tests/responsive.spec.ts`)
- Adaptación a móviles
- Tablets y desktop
- Grids y layouts
- Visibilidad de elementos

## ⚙️ Configuración

### Playwright Config
- **Navegadores:** Chromium, Firefox, Safari (WebKit)
- **Viewport:** Móvil (375x667), Tablet (768x1024), Desktop (1280x720)
- **Timeout:** 30s por defecto
- **Retries:** 2 en CI, 0 en local

### Variables de Entorno
```bash
# Ejecutar todos los navegadores (incluyendo WebKit)
PLAYWRIGHT_ALL_BROWSERS=1 npm run test:e2e

# Forzar WebKit en Linux
FORCE_WEBKIT=1 npm run test:e2e
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **"Executable doesn't exist"**
   ```bash
   npx playwright install
   ```

2. **Tests fallan por lazy loading**
   - Los tests incluyen waits automáticos
   - Si fallan, aumentar timeout: `--timeout=60000`

3. **WebKit no funciona en Linux**
   ```bash
   sudo apt-get install libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
   ```

### Debug en Visual Studio Code
1. Instala la extensión "Playwright Test for VSCode"
2. Usa `npm run test:e2e:ui` para interfaz gráfica
3. Usa `npm run test:e2e:debug` para paso a paso

## 📊 Reportes

Después de ejecutar los tests:

```bash
# Ver reporte HTML
npx playwright show-report

# Reporte específico
npx playwright show-report test-results
```

## 🚨 Notas Importantes

1. **Lazy Loading:** Los tests esperan a que las secciones carguen con `@defer`
2. **Data Test IDs:** Los tests usan `data-testid` para selección robusta
3. **Headless Mode:** Por defecto en CI, visible en local con `--headed`
4. **Screenshots:** Automáticos en fallos para debugging

## 🔄 Integración con CI/CD

Si quieres añadir tests E2E a tu pipeline de CI/CD:

```yaml
# Ejemplo GitHub Actions
- name: Run E2E tests
  run: npm run test:e2e:ci
```

O ejecutarlos manualmente antes de un deploy importante:

```bash
# Flujo completo (incluyendo E2E)
npm run test:all
```
