# Mesch 1944 – beeldgestuurde beleving (proefversie)

## Doel
De leerling verkent de bevrijding van Mesch op 12 september 1944. De historische schilderingen staan centraal; het doel is historisch bewustzijn, geen score of gamelevel.

**Proefversie:** [beleving.html](../beleving.html) — [open de beleving via GitHub Pages](https://sandromeertens.github.io/Mesch-1944/beleving.html).

## Wat is daadwerkelijk gebouwd?
- Nieuwe, zelfstandige pagina naast de bestaande `index.html` (die blijft ongewijzigd).
- Grote historische afbeelding zonder permanente zijbalk.
- Navigeren en teruglopen uitsluitend via klikplekken **op** de schildering. Geen vaste Terug/Verder-knoppen.
- Gesprekken in context: geen los verzonnen portret. Vijf personages en hun vragen, geërfd uit de bestaande app.
- Historische informatie bij voorwerpen en scènes, met bronindicatie en duidelijke reconstructiewaarschuwing.
- Plekkenoverzicht **zonder sprongknoppen**: verplaatsen gebeurt via het beeld.
- Waarschuwingen bij overgangen tussen verschillende fasen van 12 september 1944.
- Logboek verwijderd uit deze nieuwe leerlingervaring.
- Bestaande 42 afbeeldingen/scènes blijven in de oorspronkelijke app bewaard; 21 scènes vormen het testnetwerk in de nieuwe versie.

## Wat is NOG NIET bewezen of gebouwd?
- Dit is **geen echte 360°-Street View**. De leerling beweegt tussen gewone schilderingen.
- De afgebeelde camera's, gebouwgevels en interieurplattegronden zijn **niet overal historisch geijkt**.
- Routes/hotspotposities zijn voorlopig, niet gecertificeerd als fysieke 1944-looproutes.
- Geen bewezen realistische plattegrond van Mesch in 1944.
- Mobiele visuele tests en gebruikerstests met leerlingen moeten nog plaatsvinden.
- Er zijn geen nieuw ontdekte bronnen geverifieerd tijdens deze technische iteratie.
- Portretgelijkenis en letterlijke dialoog zijn voor de meeste personen niet historisch aangetoond.

## Ruimtelijke controlepunten
1. Gevel school/schoolwoning: daklijn, raamvolgorde, ingang en verbinding met de kelder verifiëren.
2. Café Van Hoven: 1944-gevel en binnenindeling, eventuele achterkamer/kelderverbinding verifiëren.
3. Grijzegraaf: geografische as en kijkrichtingen vastleggen met historische kaart en controlefoto's.
4. Veldroute/hei/overgave: geen looproute via een heg of gebouw tekenen zonder bewijs.
5. Mescherbrug/Bovenstraat: brongebonden uitbreiding, geen willekeurig brugdecor.

## Technische controles
Uitgevoerd bij eerste uitgave:
- JavaScript syntaxcorrect.
- Alle 21 testnodes bereikbaar vanuit startscene via de routegraaf.
- Geen ontbrekende scènebestemmingen.
- Elke in de nieuwe routegraaf aangemaakte verbinding heeft een terugrichting.
- Gesprek met drie vragen en bronpaneel kunnen programmatisch worden geopend.
- De nieuwe pagina bevat geen vaste `btnPrev`, `btnNext` of `Mijn ontdekkingen`-interface.
- GitHub Pages heeft de eerste commit succesvol gebouwd/gepubliceerd.

**Nog handmatig te controleren op Android en tablet:** hotspottrefzekerheid, plaatsing op werkelijke weg/deur, leesbaarheid gesprekspaneel, mobiel staand/liggend, laadsnelheid van schilderingen en de leesbaarheid van bronverwijzingen.

## Volgende mijlpaal
Een smalle, aantoonbaar correcte route langs de Grijzegraaf, oude school en Café Van Hoven.

Gebruik:
- `ARCHIEFFOTOREGISTER_R9.csv`
- `CONTINUITEIT_EN_VOLGENDE_CORRECTIES.md`
- `GEVELCONTROLE_school_en_cafe_INTERN.jpg`
- Foto's en bronnen uit de eerdere projectchat

Elke route krijgt vastgelegd: (a) bronlocatie, (b) doel, (c) kijkrichting, (d) historische onderbouwing, (e) tijdvenster, (f) zekerheid.

## Architectuur voor later
Splits `SCENES`, `PEOPLE`, `TOPICS`, `ROUTES` naar gedeelde JSON-modules. Voeg pas daarna brongebonden panoramische gezichtspunten toe. Verwar crop/pan van een tweedimensionale plaat niet met een echte 360°-omgeving.
