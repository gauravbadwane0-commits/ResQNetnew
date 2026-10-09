# RESQNET (Team: Endless Coders)
### Problem Statement ID: HC-05 — "Climate Aware Emergency Response Network"

> **A Mobile-First, Installable Progressive Web App (PWA) for India that warns citizens about climate hazards, shows usable roads, guides injured victims to the nearest hospital, and allows 1-tap SOS dispatch — fully operational even on weak or offline connections.**

---

## 🌟 Key Features

1. **🚨 1-Tap Emergency SOS with 5-Second Cancel Window:**
   - Prominent pulsating Crimson SOS button with ripple animations.
   - 5-second circular cancel countdown to prevent accidental dispatches.
   - On dispatch, automatically generates a comprehensive Indian emergency payload with exact GPS coordinates, Google Maps pin, time in IST, and device-saved Medical Card info.
   - Dispatches seamlessly via Web Share API, WhatsApp intent, and default SMS.
   - Instant direct `tel:112` bypass link.

2. **🔊 Web Audio Search-and-Rescue Siren Beacon:**
   - Synthesizes an alternating dual-tone distress audio beacon (500Hz ↔ 1000Hz sweep) using the Web Audio API.
   - Allows victims trapped under debris, waterlogged rooftops, or zero-visibility rain to audibly signal rescue teams without needing cellular data.

3. **📞 100% Offline India Emergency Helplines:**
   - National Emergency (112), Disaster Ambulance & Trauma (108), Fire & Water Rescue (101), NDRF National Disaster Response (1070), District Disaster Control (1077), Women in Distress (1091 & 181), and Health Advice (104).
   - Fast search, category filters, and 1-tap direct phone dialers.

4. **🌧️ Climate & Heavy Rain Hazard Engine (Open-Meteo):**
   - Live precipitation and flood risk analysis powered by Open-Meteo APIs (100% free, no API keys).
   - Computes cumulative 24-hour and 72-hour rainfall totals with flood risk scores.
   - Dynamic Low (Green), Medium (Amber), and High Alert (Red) status badges.
   - 16-hour hourly rainfall intensity bar chart.
   - Text-to-Speech (Web Speech API) voice alert read-aloud in English, Hindi, and Marathi.

5. **🗺️ Live Crisis Map with Hospital & Clinic Badges:**
   - Interactive Leaflet map with support for **CartoDB Dark Matter**, **Mapbox Dark / Navigation**, **MapTiler Cloud**, **Stadia Maps**, or **OpenStreetMap**.
   - **Configurable Map API Key**: Enter your Mapbox or MapTiler API Key in the UI modal or via `.env` (`VITE_MAP_API_KEY`). If left empty, it runs automatically on free CartoDB/OSM tiles with zero keys required!
   - **🏥 Red Cross Badges** for 24x7 Emergency Hospitals & Trauma Centers.
   - **🩺 Cyan Badges** for Primary Health Centers (PHCs) and Clinics.
   - **⛺ Emerald Badges** for Disaster Relief Camps.
   - Dynamic flood risk circles plotted on vulnerable basins.
   - Live GPS tracking with accuracy circle.

6. **🧭 Turn-by-Turn Routing via OSRM:**
   - OSRM public routing engine plots driving evacuation corridors directly on the map.
   - Fallback geodesic path generator ensures routes are drawn even when offline.

7. **⚠️ Crowd-Sourced Road Availability Network:**
   - Report waterlogged underpasses, fallen trees, submerged bridges, and mudslides.
   - Community "Still Blocked?" verification votes.
   - 4-hour automatic expiration clock to prevent stale hazard data.

8. **🩸 Local-Only Emergency Medical Card (ICE):**
   - Blood group, age, allergies, chronic conditions, and emergency contacts.
   - Stored 100% on the device (`localStorage`) for privacy and zero-latency retrieval.
   - Paramedic QR code generator for screen scanning without unlocking the phone.

9. **🌐 Multilingual & High-Contrast Accessibility:**
   - Complete 3-language localization: English, Hindi (हिंदी), Marathi (मराठी).
   - WCAG AAA contrast, min 48px touch targets, mobile-first design for 360px phones.

10. **📶 Offline Mode & PWA Installability:**
    - Service Worker (`sw.js`) caches app shell, static assets, and emergency registries.
    - Prominent sticky offline banner.
    - "Simulate Offline Mode" toggle in navbar for hackathon judges to test offline resilience on live WiFi.

---

## 🛠️ Technology Stack & Map API Configuration

| Component | Technology | Rationale |
|---|---|---|
| Framework | **React 18 + Vite + TypeScript** | High performance, type safety, instant HMR |
| Styling | **Tailwind CSS v3.4** | Dark Navy emergency theme (`#060A12`) |
| Mapping Engine | **Leaflet.js + Multi-Provider** | Supports Mapbox API keys, MapTiler, Stadia, and Free CartoDB |
| Healthcare POIs | **Overpass API (OpenStreetMap)** | Real-time crowdsourced hospitals & clinics |
| Routing Engine | **OSRM (Open Source Routing Machine)** | Free turn-by-turn geometry |
| Climate & Flood | **Open-Meteo Forecast & Rain API** | Free, open-source meteorological data |
| Audio Beacon | **Web Audio API** | Hardware siren synthesis without external audio files |

---

### 🔑 Map API Key Options

RESQNET supports **two ways** to provide and use a Map API Key:

#### Option 1: Live In-App Setting (Zero Setup)
On the **Live Map** screen, tap the **"Key: CartoDB / Mapbox (API)"** pill at the bottom-left:
- Select your provider: **Mapbox**, **MapTiler**, **Stadia Maps**, **Geoapify**, or **CartoDB (Free)**.
- Paste your API Key / Access Token.
- Choose your visual style (Dark Navy, Satellite Hybrid, Streets).
- Tapping **Save** immediately switches the live map tiles!

#### Option 2: Environment Variables (`.env`)
In your project root, copy `.env.example` to `.env`:
```env
VITE_MAP_PROVIDER=mapbox
VITE_MAP_API_KEY=pk.eyJ1...your_token_here
VITE_MAPBOX_STYLE=dark-v11
```
*Note: If you leave `VITE_MAP_API_KEY` blank, the app gracefully defaults to 100% free CartoDB Dark Matter / OSM tiles, ensuring the app never shows a blank map.*
| Voice Narration | **Web Speech Synthesis API** | Native multilingual voice read-aloud |
| Offline / PWA | **Service Worker + Web App Manifest** | Full mobile home-screen installability |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-team/resqnet.git
cd resqnet

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser. Open DevTools in mobile responsive mode (iPhone SE or 360px width) for the optimal experience.

---

## 🚢 Deployment Guide (Vercel)

### Option A: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Deploy via Vercel Dashboard (Git)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `resqnet` repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**. Zero environment variables or API keys are needed!

---

## 🎤 2-Minute Hackathon Judging Demo Script

*Timing: Exactly 120 seconds. Focus on innovation, problem statement relevance, and technical execution.*

### 0:00 - 0:25 | The Problem & The Hook
> *"Respected judges, during catastrophic urban flooding in Mumbai or Chennai, cellular networks throttle, underpasses submerge, and citizens panic. Dialing numbers takes too long and people don't know which hospital has an open route.*  
> *We are team **Endless Coders**, and we built **RESQNET** for Problem Statement **HC-05: Climate Aware Emergency Response Network** — an installable, mobile-first PWA for India that works even when internet connectivity dies."*

### 0:25 - 0:50 | The 1-Tap SOS & Physical Audio Siren
> *(Demonstrating Home screen)*  
> *"First: when disaster strikes, people don't have time to type. With **one tap on the central SOS button**, a 5-second countdown initiates. If not canceled, it automatically generates an emergency dispatch with live GPS coordinates, Google Maps link, and the user's emergency medical card — opening WhatsApp and SMS.*  
> *Notice this **Rescue Siren button**: it uses the Web Audio API to synthesize a high-decibel alternating distress beacon. If someone is trapped under a collapsed ceiling or on a submerged rooftop in heavy fog, rescue workers can find them by sound alone."*

### 0:50 - 1:15 | Climate Hazards & Map Navigation
> *(Showing Climate Risk Card & Live Map)*  
> *"Look at our **Climate Hazard Status**: we pull live data from Open-Meteo with 24-hour and 72-hour rainfall totals, calculating a real-time flood risk index. Citizens can tap **Listen to Audio Alert**, and our app reads the safety advisory aloud in English, Hindi, or Marathi.*  
> *Switching to the **Live Map**: we use Leaflet and the Overpass API with **zero paid keys**. Red cross badges show 24x7 trauma hospitals, cyan badges show clinics, and emerald badges show relief shelters. Tapping 'Route' instantly plots an OSRM evacuation corridor avoiding submerged hazard points."*

### 1:15 - 1:40 | Crowd-Sourced Roadblocks & Medical ID
> *(Switching to Roadblocks & Profile)*  
> *"Under **Roadblocks**, citizens report submerged underpasses or fallen trees. Other commuters tap **'Still Blocked?'** to verify reports, and pins automatically expire after 4 hours to keep data fresh.*  
> *Under **Medical ID**, blood groups, allergies, and ICE contacts are stored strictly on the device for privacy. First responders can simply scan the on-screen **Paramedic QR code** without even unlocking the phone."*

### 1:40 - 2:00 | The Closer: Offline Resilience
> *(Tapping 'Simulate Offline' button in navbar)*  
> *"Finally, the ultimate test: if network towers collapse, we tap **Simulate Offline Mode**. An offline banner appears, yet the helplines, last known risk data, and nearest hospital registry remain 100% accessible via our Service Worker.*  
> *RESQNET is fully open-source, free to scale, and ready for deployment. Thank you!"*
