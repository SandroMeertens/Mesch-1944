# Mesch 1944 — R3-scèneplan voor de negen resterende lesgameplaten

Datum: 25 november 2026. Dit document is **beeldregie en audit**, geen claim dat de nieuwe schilderingen al gemaakt of gepubliceerd zijn. De zeven R2-platen staan apart in `lesgame/beelden/r2/`. De GitHub Pages-livegang controleren we afzonderlijk.

## Gecontroleerde broncode

De lesgame bevat 16 speelplekken. Zeven scènes gebruiken een R2-afbeelding; de volgende negen verwijzen nog naar de oude WebP-versie:

| # in route | Scène | Code-ID | Huidig bestand | Regie van de nieuwe plaat |
|---|---|---|---|---|
| 2 | Bij de heg | 20 | `beelden/20-33d05d31f5.webp` | Amerikaanse nadering langs heggen, bewoners voorzichtig achter begroeiing, géén feestelijk onthaal; bladrijk septemberlandschap |
| 5 | Aan de Grijzegraaf | 21 | `beelden/21-c2f03c2244.webp` | Later contact tussen militairen en inwoners; schoolomgeving alleen fotogebonden; laat sfeer verschillen van overgave |
| 6 | Tussen de dorpshuizen | 11 | `beelden/11-a81b18d1c7.webp` | Doorlopende dorpsstraat op ooghoogte; slechts gecontroleerde historisch passende gevelvolumes; soldaten onderweg, geen parade |
| 8 | Bij de buren | 12 | `beelden/12-7759df69ef.webp` | Huisdrempel, buren voorzichtig naar buiten; emotie gemengd; geen modern straatmeubilair |
| 10 | Langs de velden | 06 | `beelden/06-cc0e3fd621.webp` | Akkers, weide en heggen als geografische route; gebruik luchtfoto 1944 alleen voor hoofdroutes, niet voor individuele bomen of huizen |
| 13 | In de schuilkelder | kelder | `beelden/kelder-4ce8f6b5da.webp` | Gezinsleden tijdens beschietingen, ingehouden licht en spanning, geen vrolijke ontvangst; exacte trap en kelderplattegrond zijn onbekend |
| 14 | Bij de veldkeuken | veldkeuken | `beelden/veldkeuken-9ad792959d.webp` | Later menselijk contact rondom voeding, geen onbewezen voertuigtype; focus op kind en Amerikaanse kok |
| 15 | In de schoolwoning | 04 | `beelden/04-14bc4a1e45.webp` | Nachtelijke rust na bevrijding, Amerikaanse soldaat te gast; geen doorgang suggereren naar dezelfde kelder zonder gebouwbewijs |
| 16 | In het schoollokaal | schoollokaal | `beelden/schoollokaal-d3b897e804.webp` | Schoolinterieur met bureau, inkt en banken; raamrichting en ingang afstemmen op geverifieerde schoolgevel, geen exact interieur als feit presenteren |

## Historische ijkpunten uit de aangeleverde projectbronnen

- Archiefregister A02: luchtfoto Moelingen–Mesch (1944) helpt bij wegen en heggen, **niet** bij elke deur of boom.
- A03: school-/raadhuis-/woningfoto geeft aanwijzingen voor daklijn en raamverdeling, maar opnamejaar en situatie op 12 september staan niet vast.
- A04: latere foto Café Van Hoven bewijst geen exacte cafégevel in 1944; reclame of naoorlogse borden niet overnemen.
- A06/A07: pantserwagen en tank zijn geen bewijs voor aanwezigheid op een specifieke Meschse straathoek; geen onbewezen voertuig reconstrueren.
- A09: Raleigh-wikkel en notitie geven een concrete didactische invalshoek voor inkt, schrijven en getuigenissen.
- Het eerste-contactbewijs onderscheidt nadrukkelijk **overgave** van het **latere warme onthaal**.

## Bevindingen in spelroute (eerst uitwerken, nog niet gewijzigd)

1. Na `In Café Van Hoven` volgt direct `In de schuilkelder`. Deze opeenvolging wekt de indruk van een fysieke doorgang café→kelder. De projectbronnen onderbouwen die verbinding **niet**. Vervang dit conceptueel door een duidelijke filmische scène-/perspectiefwisseling; vermijd een deur-/traphotspot die een echte plattegrond suggereert.
2. Na `Bij de veldkeuken` kan de schoolwoning via een gesprek bereikt worden. Dit is een ander moment dan schuilen tijdens gevechten. Houd het contrast in licht, geluid en gesprek duidelijk; geen klok of storend tussenscherm.
3. Bij het schoollokaal moeten deur, gevel en portret ruimtelijk aansluiten op een fotogebonden schoolpaspoort.
4. R2 heeft zeven mobiele bestanden, maar de negen oude scènes hebben niet automatisch zulke mobiele R3-varianten; pas de mobiele bronkeuze aan wanneer de nieuwe schilderingen gereed zijn.
5. Houd portretgesprekken, terugroute, tekstballonnen en hotspot-verbindingen beschikbaar tijdens elk vervangen van een plaat.

## Productievoorwaarden voor alle negen

- Nieuwe native schilderingen; geen simpele vergroting van 1660–1672px-bestanden. Richtformaat 16:9 met ruime compositiemarge voor telefoonuitsnede.
- Vaste warme realistische olieverfstijl, menselijke ooghoogte ca. 145–160 cm, Zuid-Limburgs groen in september; geen felle najaarskleuren.
- Gebouwen vóór sfeer: gevels, raamvolgorde en dakvorm prioriteren wanneer een betrouwbare referentie aanwezig is; onbewezen details niet presenteren als exacte reconstructie.
- Geen moderne borden, monumenten, naoorlogse reclame, gedocumenteerd onjuiste uniformpatches of zonder bron bevestigde tank/jeep.
- Bewaar afzonderlijk groot WebP, mobiel WebP, herkomst-/onzekerheidsnotitie en hotspotplan. Pas de live game pas aan na beeldcontrole.
- Test op telefoon (staand), iPad (staand en liggend), en digibord (breed); controleer dat gesprek-/routeknoppen zichtbaar blijven en dat terugnavigatie werkt.

## Releasecriterium

R3 heet pas **klaar** wanneer negen nieuwe afzonderlijke eindplaten bestaan, hun historische vrijgave per plaat is gecontroleerd, iedere scène in `lesgame/index.html` naar de correcte nieuwe naam verwijst, alle assets werkelijk in GitHub staan en de Pages-deploy en visuele routecontrole slagen. Tot die tijd worden de originele negen beelden en portretten behouden.
