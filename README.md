# BarberQ - Vite + Tailwind CSS Oppsett

## Installasjon

### Steg 1: Installer Node.js
Du må først installere Node.js (som inkluderer npm):
1. Gå til https://nodejs.org/
2. Last ned LTS-versjonen (anbefalt)
3. Installer og restart terminalen

### Steg 2: Installer dependencies
```bash
npm install
```

### Steg 3: Start development server
```bash
npm run dev
```

Nettsiden vil åpnes automatisk på http://localhost:3000

## Scripts

- `npm run dev` - Start development server med hot reload
- `npm run build` - Bygg produksjonsklare filer til `dist/` mappen
- `npm run preview` - Preview production build lokalt

## Struktur

```
BarberQ/
├── src/
│   ├── css/
│   │   ├── main.css       # Tailwind directives + import av style.css
│   │   └── style.css      # Eksisterende custom styles
│   └── js/
│       ├── main.js        # Vite entry point
│       └── script.js      # Eksisterende JavaScript
├── images/                # Statiske bilder
├── index.html            # Hoved HTML fil
├── package.json          # npm dependencies
├── vite.config.js        # Vite konfigurasjon
├── tailwind.config.js    # Tailwind konfigurasjon
└── postcss.config.js     # PostCSS konfigurasjon
```

## Hva er endret?

1. ✅ Fjernet Tailwind CDN script
2. ✅ Satt opp Vite som build tool
3. ✅ Konfigurert Tailwind CSS med PostCSS
4. ✅ Flyttet filer til `src/` struktur
5. ✅ Opprettet entry point (`src/js/main.js`)
6. ✅ Oppdatert HTML til å bruke Vite module script

## Fordeler med Vite + Tailwind

- ⚡ Ekstremt rask hot reload (HMR)
- 📦 Optimalisert production builds
- 🎨 Full Tailwind CSS funksjonalitet (ikke CDN-begrenset)
- 🔧 Mulighet for custom Tailwind plugins
- 📁 Organisert prosjektstruktur
- 🚀 Bedre ytelse i produksjon
