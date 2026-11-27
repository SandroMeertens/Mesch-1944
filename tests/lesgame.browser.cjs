/* Automatische toetsen voor de bestaande leerlinggame Mesch 1944. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { chromium, webkit } = require("playwright");

const URL = "http://127.0.0.1:8765/lesgame/";
async function openGame(browser, viewport, intro = false) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("requestfailed", req => {
    if (req.url().includes("/lesgame/")) errors.push("Network error: " + req.url());
  });
  const response = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  assert.equal(response.status(), 200);
  if (!intro) {
    await page.locator("#intro-overslaan").waitFor({ state: "visible" });
    await page.waitForFunction(() => !document.querySelector("#intro-overslaan").disabled);
    await page.locator("#intro-overslaan").click();
    await page.locator("#intro").waitFor({ state: "hidden", timeout: 15000 });
  }
  return { page, errors };
}
async function loadedImage(page, selector = "#plaat") {
  await page.waitForFunction(s => {
    const img = document.querySelector(s);
    return img && img.complete && img.naturalWidth > 0;
  }, selector, { timeout: 15000 });
}
async function expectPlace(page, title) {
  await page.waitForFunction(
    text => document.querySelector("#plek")?.textContent === text,
    title,
    { timeout: 20000 }
  );
  assert.equal(await page.locator("#plek").textContent(), title);
}
async function assertNoPageErrors(errors) {
  assert.deepEqual(errors, [], "JavaScript- of netwerkfout in het spel");
}
async function antwoordGesprek(page) {
  await page.locator("#praat").click();
  await page.locator("#gesprek").waitFor({state:"visible"});
  await loadedImage(page, "#portret");
  assert.equal(await page.getByRole("button",{name:"Lees verder",exact:true}).count(),0);
  assert.equal(await page.getByRole("button",{name:"Toon hele tekst"}).count(),0);
  assert.equal(await page.getByRole("button",{name:"Naar de vraag"}).count(),0);
  assert.equal(await page.getByRole("button",{name:"Naar de tegenvraag"}).count(),0);
  assert.ok(await page.locator("#opties .keuze").count()>=2,"Vraag met antwoordkeuzes ontbreekt");
  await page.locator("#opties .keuze").first().click();
  assert.equal(await page.locator("#sluit").isHidden(),true,"Tegenvraag moet nog beantwoord worden");
  await page.locator("#opties .keuze").first().click();
  assert.equal(await page.locator("#sluit").isVisible(),true);
  await page.locator("#sluit").click();
  await page.locator("#gesprek").waitFor({state:"hidden"});
}
(async () => {
const browser = await chromium.launch({ headless:true, args:["--no-sandbox"] });
try {
  await test("Intro: twee zinnen, automatische opening, geen startknop", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768},true);
    try{
      assert.equal(await page.locator("#intro").isVisible(),true);
      assert.equal(await page.locator("#intro").getAttribute("data-proloog"),"1");
      assert.equal(await page.locator(".proloog-zin-een").textContent(),"Vier jaar lang leefde Nederland in oorlog.");
      assert.equal(await page.locator(".proloog-zin-twee").textContent(),"Maar in Zuid-Limburg komt de bevrijding dichterbij");
      assert.equal(await page.locator("#verken").count(),0);
      await page.waitForFunction(()=>document.querySelector("#intro").dataset.proloog==="2",null,{timeout:5500});
      await page.locator("#intro").waitFor({state:"hidden",timeout:10000});
      await expectPlace(page,"Dorpsrand");
      await loadedImage(page);
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Geen leestimer, geen klik-vooruit, alleen antwoordkeuzes", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      assert.equal(await page.locator("#leestijd-status").count(),0);
      const oldTimer=await page.evaluate(()=>typeof MIN_LEESTIJD_MS);
      assert.equal(oldTimer,"undefined","Leestimer moet echt uit de code zijn");
      await page.locator("#praat").click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      assert.equal(await page.getByRole("button",{name:"Lees verder"}).count(),0);
      assert.equal(await page.getByRole("button",{name:"Toon hele tekst"}).count(),0);
      assert.equal(await page.locator("#opties .keuze").count(),2);
      const title=await page.locator("#antwoord").textContent();
      assert.match(title,/Wat wil jij over onze aankomst uitzoeken\?/);
      await page.locator("#sluit").click();
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Dorpsroute blijft gesloten tot de tegenvraag is beantwoord", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      const verder=page.locator("#routes button[data-heen]");
      assert.equal(await verder.getAttribute("data-locked"),"");
      await verder.click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      await expectPlace(page,"Dorpsrand");
      await page.locator("#sluit").click();
      assert.equal(await verder.getAttribute("data-locked"),"","Openen en sluiten telt niet");
      await page.locator("#praat").click();
      await page.locator("#opties .keuze").first().click();
      assert.equal(await verder.getAttribute("data-locked"),"","Eerste keuze telt niet als volledig gesprek");
      await page.locator("#opties .keuze").first().click();
      assert.equal(await verder.getAttribute("data-locked"),null,"Een beantwoorde tegenvraag geeft meteen toegang");
      await page.locator("#sluit").click();
      await verder.click();
      await expectPlace(page,"Bij de heg");
      assert.equal(await page.locator("#routes button[data-heen]").getAttribute("data-locked"),"","Per plaat opnieuw praten");
      await page.keyboard.press("ArrowRight");
      await page.locator("#gesprek").waitFor({state:"visible"});
      await expectPlace(page,"Bij de heg");
      await page.locator("#sluit").click();
      await page.getByRole("button",{name:"Dorpsrand",exact:true}).click();
      await expectPlace(page,"Dorpsrand");
      assert.equal(await page.locator("#routes button[data-heen]").getAttribute("data-locked"),null,"Gesprek blijft afgerond bij terugkeren");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Gesprek kent geen wachttijd en kan direct worden afgerond", async () => {
    const {page,errors}=await openGame(browser,{width:1280,height:800});
    try{
      await antwoordGesprek(page);
      assert.equal(await page.locator("#routes button[data-heen]").getAttribute("data-locked"),null);
      const state=await page.evaluate(()=>window.sessionStorage.getItem("mesch-gesproken-plekken-v1"));
      assert.match(state,/\b0\b/);
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Nieuwe lesronde vergrendelt de vragen opnieuw", async () => {
    const {page,errors}=await openGame(browser,{width:1280,height:800});
    try{
      await antwoordGesprek(page);
      await page.locator("#herstart").click();
      await page.locator("#start-ronde").click();
      await expectPlace(page,"Dorpsrand");
      assert.equal(await page.locator("#routes button[data-heen]").getAttribute("data-locked"),"");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Bij de school: zijroute beschermd, terugweg vrij", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      for(let i=0;i<3;i++){
        await antwoordGesprek(page);
        await page.locator("#routes button[data-heen]").click();
      }
      await expectPlace(page,"Bij de school");
      const deur=page.getByRole("button",{name:"Ga het schoollokaal in"});
      assert.equal(await deur.getAttribute("data-locked"),"");
      await deur.click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      await expectPlace(page,"Bij de school");
      await page.locator("#sluit").click();
      await antwoordGesprek(page);
      assert.equal(await deur.getAttribute("data-locked"),null);
      await deur.click();
      await expectPlace(page,"In het schoollokaal");
      await loadedImage(page);
      await page.getByRole("button",{name:"Terug naar buiten bij de school"}).click();
      await expectPlace(page,"Bij de school");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Volledige hoofdroute, alle 14 opeenvolgende platen laden", async () => {
    const {page,errors}=await openGame(browser,{width:1440,height:900});
    try{
      const places=["Dorpsrand","Bij de heg","Eerste contact","Bij de school","Aan de Grijzegraaf","Tussen de dorpshuizen","De dorpsstraat","Bij de buren","Het dorpshart","Langs de velden","Voor Café Van Hoven","In Café Van Hoven","In de schuilkelder","Bij de veldkeuken"];
      for(let i=0;i<places.length;i++){
        await expectPlace(page,places[i]);
        await loadedImage(page);
        if(i<places.length-1){
          await antwoordGesprek(page);
          await page.locator("#routes button[data-heen]").click();
        }
      }
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Alle portretten en inhoudelijke tegenvragen werken", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      const names=["Dorpsrand","Bij de heg","Eerste contact","Bij de school","Aan de Grijzegraaf","Tussen de dorpshuizen","De dorpsstraat","Bij de buren","Het dorpshart","Langs de velden","Voor Café Van Hoven","In Café Van Hoven","In de schuilkelder","Bij de veldkeuken"];
      assert.equal(await page.locator("#gesprek").evaluate(x=>x.parentElement.id),"spel");
      for(let i=0;i<names.length;i++){
        await expectPlace(page,names[i]);
        await antwoordGesprek(page);
        assert.equal(await page.locator("#routes button[data-heen]").getAttribute("data-locked"),null);
        if(i<names.length-1)await page.locator("#routes button[data-heen]").click();
      }
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Café: doeken bekijken, vragen beantwoorden en teruggaan", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      for(let i=0;i<11;i++){
        await antwoordGesprek(page);
        await page.locator("#routes button[data-heen]").click();
      }
      await expectPlace(page,"In Café Van Hoven");
      await page.locator("#praat").click();
      await page.getByRole("button",{name:"Bekijk de doeken op tafel"}).click();
      assert.equal(await page.locator("#cafe-aanwijzing").isVisible(),true);
      await page.locator("#doeken").click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      await page.locator("#opties .keuze").first().click();
      await page.locator("#opties .keuze").first().click();
      await page.locator("#sluit").click();
      await expectPlace(page,"In Café Van Hoven");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Inhoudelijke antwoordkeuze wordt bewaard, zonder tekst-doorklikken", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      await page.locator("#praat").click();
      await page.locator("#opties .keuze").nth(1).click();
      assert.equal(await page.getByRole("button",{name:"Naar de tegenvraag"}).count(),0);
      assert.equal(await page.locator("#sluit").isHidden(),true);
      await page.locator("#opties .keuze").first().click();
      assert.equal(await page.locator("#sluit").isVisible(),true);
      const saved=await page.evaluate(()=>JSON.parse(window.sessionStorage.getItem("mesch-verhaalkeuze-v1")));
      assert.equal(saved.soldaat,1);
      await page.locator("#sluit").click();
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Telefoon, iPad en digibord: navigatie zonder pagina-scrollen", async () => {
    for(const viewport of [{width:390,height:844},{width:844,height:390},{width:820,height:1180},{width:1180,height:820},{width:1920,height:1080}]){
      const {page,errors}=await openGame(browser,viewport);
      try{
        await loadedImage(page);
        const metrics=await page.evaluate(()=>({
          vw:innerWidth,vh:innerHeight,
          scrollW:document.documentElement.scrollWidth,
          scrollH:document.documentElement.scrollHeight,
          game:(()=>{const r=document.querySelector("#spel").getBoundingClientRect();return {w:r.width,h:r.height}})()
        }));
        assert.ok(metrics.scrollW<=metrics.vw+2 && metrics.scrollH<=metrics.vh+2,JSON.stringify(metrics));
        assert.ok(metrics.game.w>0 && metrics.game.h>0);
        await antwoordGesprek(page);
        await page.getByRole("button",{name:"Volg de weg het dorp in"}).click();
        await expectPlace(page,"Bij de heg");
        await loadedImage(page);
        await page.locator("#praat").click();
        await loadedImage(page,"#portret");
        await page.locator("#sluit").click();
        await assertNoPageErrors(errors);
      }finally{await page.close();}
    }
  });

  await test("WebKit op iPhone en iPad: inhoudelijke vragen en route", async () => {
    const safari=await webkit.launch({headless:true});
    try{
      for(const viewport of [{width:820,height:1180},{width:390,height:844}]){
        const {page,errors}=await openGame(safari,viewport);
        try{
          await antwoordGesprek(page);
          await page.getByRole("button",{name:"Volg de weg het dorp in"}).click();
          await expectPlace(page,"Bij de heg");
          await loadedImage(page);
          await page.locator("#praat").click();
          await page.locator("#gesprek").waitFor({state:"visible"});
          await loadedImage(page,"#portret");
          await page.locator("#sluit").click();
          await assertNoPageErrors(errors);
        }finally{await page.close();}
      }
    }finally{await safari.close();}
  });
} finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
