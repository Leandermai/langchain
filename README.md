# Bewerbungs-Agent mit RAG und LLM

Ein intelligenter Bewerbungsassistent, der aktuelle Stellenangebote aus dem Web scraped, mit Retrieval-Augmented Generation (RAG) die wichtigsten Infos extrahiert und mit Hilfe eines LLM (z.B. Groq Llama) personalisierte Bewerbungsschreiben generiert. Das Webinterface ermöglicht eine komfortable Suche und Bewerbung.

---

## Features
- **Webscraping**: Holt aktuelle IT-Jobs (z.B. von remoteok.com) inkl. Firmenname, Standort, Gehalt, Tags, Beschreibung u.v.m.
- **RAG-Abschnittsextraktion**: Erkennt automatisch Aufgaben, Profil, Benefits etc. in der Stellenbeschreibung
- **Intelligente Filter**: Suche nach Fähigkeiten (Skills) und/oder gesuchtem Bereich (z.B. Fullstack, Backend, Frontend)
- **Personalisierte Bewerbung**: Nutzer kann eigene Stärken/"Über mich"-Text eingeben, der in die Bewerbung einfließt
- **Schöne Darstellung**: Übersichtliche Anzeige aller Jobdetails und Abschnitte im Webinterface
- **Bewerbung als PDF/TXT herunterladen**

---

## Technische Umsetzung
- **Backend**: Node.js, Express, Webscraping mit Cheerio & Axios, RAG-Logik, LLM-Anbindung (Groq Llama)
- **Frontend**: Plain JS, HTML, CSS (keine Frameworks nötig)
- **RAG**: Regex-basierte Abschnittsextraktion für deutsche Stellenanzeigen

---

## Genutzte AI-Tools
| AI-Tool         | Use Case                        | Scope of usage                                  |
|-----------------|---------------------------------|-------------------------------------------------|
| ChatGPT 4o      | Setup, Code-Review, Ideen       | Unterstützung bei Architektur und Regex          |
| Groq Llama      | LLM für Bewerbungsschreiben     | Generiert individuelle Anschreiben               |
| GitHub Copilot  | Code Completion                 | Hilft beim schnellen Schreiben von Code          |

---

## Installation
1. **Repository klonen**
   ```bash
   git clone <repo-url>
   cd langchain
   ```
2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```
3. **.env Datei anlegen** (im Hauptordner):
   ```
   GROQ_API_KEY = "dein_groq_api_key"
   ```
4. **Starten**
   ```bash
   npm start
   ```
5. **Im Browser öffnen:**
   [http://localhost:3000](http://localhost:3000)

---

## Nutzung
- Trage Name, E-Mail, Fähigkeiten (Komma-getrennt), gesuchten Bereich und optional ein paar Worte zu dir ein
- Suche nach passenden Jobs und lasse dir die wichtigsten Infos extrahiert anzeigen
- Schreibe mit einem Klick eine individuelle Bewerbung und lade sie als PDF/TXT herunter

---

## Beispiel-Queries
- Fähigkeiten: `JavaScript, React, Node.js`
- Bereich: `Fullstack, Backend`
- Über mich: `Teamplayer, 3 Jahre Erfahrung, kreativ`

---

## Konfiguration
- `.env` Datei im Hauptverzeichnis mit folgendem Inhalt:
  ```
  GROQ_API_KEY = "dein_groq_api_key"
  ```

---

## Hinweise
- Die Jobdaten werden live gescraped, daher kann die Ergebnisanzahl und -qualität je nach Tageszeit und Quelle variieren.
- Die Filterung ist flexibel: Du kannst nur Skills, nur Bereich oder beides angeben (Komma-getrennt, Groß-/Kleinschreibung egal).
- Unsinnige Eingaben liefern keine Ergebnisse.

---

Viel Erfolg bei deiner Bewerbung! 🚀

