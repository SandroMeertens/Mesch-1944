# Mesch 1944 — interactieve dorpswandeling

Een interactieve, filmische verkenning van de bevrijding van Mesch op 12 september 1944, bedoeld voor groep 8.

## Nieuw: historische beleving (proefversie)

[**Open Mesch 1944 als beeldgestuurde historische wandeling**](https://sandromeertens.github.io/Mesch-1944/beleving.html)

Dit is een nieuwe, zelfstandige proefversie **naast** de bestaande website. De schilderingen vormen de navigatie: je loopt via klikplekken in de beelden, kunt teruglopen via dezelfde omgeving, spreekt personen aan en onderzoekt historische broninformatie. Er zijn geen logboek, vaste vorige/volgende-knoppen of verplichte score-opdrachten. De oorspronkelijke zoekplaten zijn op relevante momenten bereikbaar.

**Let op:** de beelden zijn artistieke reconstructies; er is nog geen echte 360°-Street View of historisch ingemeten stratenstelsel. Zie [bouw- en bronnenverantwoording](docs/BELEVING_V14.md).

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
