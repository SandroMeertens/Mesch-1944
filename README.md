# Mesch 1944 — interactieve dorpswandeling

Een interactieve, filmische verkenning van de bevrijding van Mesch op 12 september 1944, bedoeld voor groep 8.


**Beeldrelease R2 (25 november 2026):** zeven nieuwe scène-afbeeldingen en zeven mobiele varianten zijn toegevoegd aan de bestaande lesgame. De overige scènes, gesprekken en looproutes blijven bestaan. De op GitHub gepubliceerde bestanden zijn automatisch gecontroleerd; controleer na de GitHub Pages-deploy de zichtbare versie via de leerlinglink.

## Start de game

**Voor leerlingen:** [Start de lesgame *De bevrijding van Mesch*](https://sandromeertens.github.io/Mesch-1944/lesgame/).

De lesgame is de hoofdversie: één begeleide route langs de schilderingen met personages, gesprekken en opdrachten, zonder pagina-scrollen. De andere twee versies zijn aanvullend:

- [Interactieve dorpswandeling](https://sandromeertens.github.io/Mesch-1944/beleving.html) — klikplekken in de schilderingen en verdiepende historische informatie.
- [360°-proefversie](https://sandromeertens.github.io/Mesch-1944/360/) — rondkijken in twee panorama's bij de school en Café Van Hoven.

De weergaven zijn artistieke reconstructies, geen exacte digitale kopie van het dorp in 1944. De 360°-proef is nog **geen** volledig aaneengesloten 360°-dorpswandeling. De leerlinggame gebruikt geen externe betaalde AI-dienst.

## Nieuw: historische beleving (proefversie)

[**Open Mesch 1944 als beeldgestuurde historische wandeling**](https://sandromeertens.github.io/Mesch-1944/beleving.html)

Dit is een nieuwe, zelfstandige proefversie **naast** de bestaande website. De schilderingen vormen de navigatie: je loopt via klikplekken in de beelden, kunt teruglopen via dezelfde omgeving, spreekt personen aan en onderzoekt historische broninformatie. Er zijn geen logboek, vaste vorige/volgende-knoppen of verplichte score-opdrachten. De oorspronkelijke zoekplaten zijn op relevante momenten bereikbaar.

**Let op:** `beleving.html` gebruikt gewone schilderingen, geen echte 360°-Street View. De afzonderlijke 360°-proef toont twee panorama's; er is nog geen historisch ingemeten, doorlopend stratenstelsel. Zie [bouw- en bronnenverantwoording](docs/BELEVING_V14.md).

## Website
Na activering van GitHub Pages: https://sandromeertens.github.io/Mesch-1944/

## Wat werkt?
- Eén vaste wandelroute door het verhaal
- Klikken op schilderijen, personen en deuren
- Portretgesprekken: links de figuur, rechts het verhaal en de vragen
- Terug naar dezelfde plaat na sluiten van het gesprek
- Platenatlas, historische ontdekkingen en regiestudio

De schilderijen en gesprekken zijn grotendeels artistieke reconstructies en niet altijd historisch of geografisch geijkt.

## Eenmalig Pages inschakelen
1. Ga naar [Repository Settings → Pages](https://github.com/SandroMeertens/Mesch-1944/settings/pages).
2. Onder **Build and deployment**, kies bij **Source** voor **GitHub Actions**.
3. Ga naar [Actions](https://github.com/SandroMeertens/Mesch-1944/actions/workflows/pages.yml) en herstart de meest recente workflow **Publiceer Mesch 1944** via **Re-run all jobs**, indien nodig.

Dit hoeft maar één keer. Daarna publiceert GitHub de site bij iedere wijziging in main.

## Bestanden
- `index.html` — de app
- `assets/` — 50 WebP-afbeeldingen, voorlopig in webgeoptimaliseerde resolutie
- `.github/workflows/pages.yml` — automatische publicatie

Publiceer geen geheime gegevens of persoonlijke informatie: de repository en de website zijn openbaar.

## Verdergaan in een nieuwe chat

Open in het project **Geschiedenis** een nieuwe chat met dit bericht:

> Ga verder met Mesch 1944 vanuit https://github.com/SandroMeertens/Mesch-1944. Lees de README en de recente commits op main. Werk in beleving.html aan de bestaande route en gebruik de live wandeling om te controleren wat leerlingen zien.

De actuele versie staat op `main`. De live leerlingroute begint bij [beleving.html](https://sandromeertens.github.io/Mesch-1944/beleving.html). De routeverbindingen staan bij `pair(...)` en `mainRoute`, de beeldgebieden bij `SCENES.*.hotspots` en de gesprekken bij `PEOPLE` en `QUESTION_PATTERNS`, allemaal in `beleving.html`.

De leerling navigeert via klikplekken op de zoekplaat. Hoofdroute, zijpaden en terugwegen blijven gekoppeld aan de bestaande scènes. Gesprekken openen als aparte portretplaat met de chat ernaast op brede schermen en eronder op smalle schermen. Controleer bij wijzigingen in elk geval de nadering, beide overgaveplaten, het onthaal en de terugkeer naar dezelfde plaat na een gesprek. Zie ook [de bronverantwoording](docs/BELEVING_V14.md) en [de documentatie over de gesprekken](docs/HISTORISCHE_CHATBOT_V1.md).
