import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";

const sections=[["H00",0,64],["H01",64,390],["H02",454,356],["H03",810,275],["H04",1085,178],["H05",1263,173],["H06",1436,100]] as const;

async function assertBox(page:import("@playwright/test").Page,id:string,y:number,h:number){
  const box=await page.locator(`[data-section-id="${id}"]`).boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs((box?.y??0)-y)).toBeLessThanOrEqual(8);
  expect(Math.abs((box?.height??0)-h)).toBeLessThanOrEqual(8);
}

test("D-062 maps every approved desktop section at 1024x1536",async({page})=>{
  await page.setViewportSize({width:1024,height:1536});
  await page.goto("/en");
  await expect(page.getByTestId("approved-homepage")).toBeVisible();

  for(const [id,y,h] of sections) await assertBox(page,id,y,h);

  const ids=[
    "H00.01","H00.02","H00.03","H00.04","H00.05",
    "H01.01","H01.02","H01.03","H01.04","H01.05","H01.06","H01.08","H01.09","H01.10","H01.11",
    "H02.01","H02.02","H02.03","H02.04","H02.05","H02.06",
    "H03A.01","H03A.02","H03A.03","H03A.04","H03A.05",
    "H03B.02","H03B.03","H03B.04","H03B.05","H03B.06",
    "H04.01","H04.02","H04.03","H04.04","H04.05","H04.06",
    "H05.02","H05.03","H05.04","H05.05",
    "H06.01","H06.02","H06.03","H06.04","H06.05","H06.06","H06.07"
  ];
  for(const id of ids) await expect(page.locator(`[data-component-id="${id}"]`)).toHaveCount(1);

  await expect(page.locator(".site-bar")).toBeHidden();
  await expect(page.locator(".review-badge")).toBeHidden();

  const body=(await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("egp");
  expect(body).not.toContain("in stock");
  expect(body).not.toContain("add to cart");

  await page.screenshot({path:"artifacts/d062-homepage-1024.png",fullPage:true});
});

test("D-062 quantifies full-page visual difference against the approved authority",async({page})=>{
  await page.setViewportSize({width:1024,height:1536});
  await page.goto("/en");
  await page.evaluate(()=>document.fonts.ready);

  const screenshot=await page.screenshot({fullPage:true});
  const screenshotBase64=screenshot.toString("base64");

  const metrics=await page.evaluate(async({screenshotBase64})=>{
    const load=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=src;
    });
    const [actual,reference]=await Promise.all([
      load(`data:image/png;base64,${screenshotBase64}`),
      load("/authority/approved-homepage-reference.webp")
    ]);

    const width=512,height=768;
    const canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true})!;

    ctx.drawImage(actual,0,0,width,height);
    const a=ctx.getImageData(0,0,width,height).data;
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(reference,0,0,width,height);
    const b=ctx.getImageData(0,0,width,height).data;

    const bands=[
      ["H00",0,32],["H01",32,227],["H02",227,405],["H03",405,543],
      ["H04",543,632],["H05",632,718],["H06",718,768]
    ] as const;
    const totals:Record<string,{abs:number;over48:number;pixels:number}>={};
    for(const [id,y0,y1] of bands) totals[id]={abs:0,over48:0,pixels:width*(y1-y0)};

    let abs=0,over32=0,over48=0;
    const pixels=width*height;
    for(let y=0;y<height;y++){
      const band=bands.find(([,y0,y1])=>y>=y0&&y<y1)!;
      const bucket=totals[band[0]];
      for(let x=0;x<width;x++){
        const i=(y*width+x)*4;
        const d=(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]))/3;
        abs+=d; bucket.abs+=d;
        if(d>32) over32++;
        if(d>48){over48++;bucket.over48++;}
      }
    }
    const regions=Object.fromEntries(Object.entries(totals).map(([id,v])=>[id,{
      meanAbsChannel:v.abs/v.pixels,
      pctPixelsOver48:v.over48/v.pixels
    }]));
    return {
      meanAbsChannel:abs/pixels,
      pctPixelsOver32:over32/pixels,
      pctPixelsOver48:over48/pixels,
      regions,width,height
    };
  },{screenshotBase64});

  console.log("D062_VISUAL_DIFF",JSON.stringify(metrics));
  writeFileSync("artifacts/d062-visual-diff.json",JSON.stringify(metrics,null,2));

  expect(metrics.meanAbsChannel).toBeLessThan(25);
  expect(metrics.pctPixelsOver48).toBeLessThan(0.14);
});

test("D-062 media slots and authority asset are stable",async({page})=>{
  await page.setViewportSize({width:1024,height:1536});
  expect((await page.request.get("/authority/approved-homepage-reference.webp")).ok()).toBeTruthy();
  await page.goto("/en");

  for(const slot of [
    "home.hero.people-group","home.hero.quality-thumb",
    "home.industries.education","home.industries.hospitality","home.industries.healthcare",
    "home.industries.corporate","home.industries.industrial","home.industries.security",
    "home.feature.fabric-blue","home.feature.design-sketch","home.work.kgc","home.work.hospitality","home.work.healthcare",
    "home.cta.building"
  ]) await expect(page.locator(`[data-media-slot="${slot}"]`)).toHaveCount(1);
  await expect(page.locator('[data-media-slot="home.hero.people-group"]')).toHaveAttribute("src","/generated/home-hero-people-group.webp");
  await expect(page.locator('[data-media-slot="home.industries.education"]')).toHaveAttribute("src","/generated/home-industries-education.webp");
  await expect(page.locator('[data-media-slot="home.industries.hospitality"]')).toHaveAttribute("src","/generated/home-industries-hospitality.webp");
  await expect(page.locator('[data-media-slot="home.industries.healthcare"]')).toHaveAttribute("src","/generated/home-industries-healthcare.webp");
  await expect(page.locator('[data-media-slot="home.industries.corporate"]')).toHaveAttribute("src","/generated/home-industries-corporate.webp");
  await expect(page.locator('[data-media-slot="home.industries.industrial"]')).toHaveAttribute("src","/generated/home-industries-industrial.webp");
  await expect(page.locator('[data-media-slot="home.industries.security"]')).toHaveAttribute("src","/generated/home-industries-security.webp");
  expect((await page.request.get("/generated/home-feature-design-sketch.svg")).ok()).toBeTruthy();
  await expect(page.locator('[data-media-slot="home.feature.design-sketch"]')).toHaveAttribute("src","/generated/home-feature-design-sketch.svg");
  expect((await page.request.get("/generated/home-cta-building-v3.webp")).ok()).toBeTruthy();
  await expect(page.locator('[data-media-slot="home.cta.building"]')).toHaveAttribute("src","/generated/home-cta-building-v3.webp");
  await expect(page.locator('[data-media-slot="home.work.kgc"]')).toHaveAttribute("src","/review-media/kgc/kgc-building.webp");
  await expect(page.locator('[data-media-slot="home.work.hospitality"]')).toHaveAttribute("src","/generated/home-industries-hospitality.webp");
  await expect(page.locator('[data-media-slot="home.work.healthcare"]')).toHaveAttribute("src","/generated/home-industries-healthcare.webp");
  await expect(page.locator('[data-media-slot="home.hero.quality-thumb"]')).toHaveAttribute("src","/generated/home-feature-fabric-blue-v1.webp");
  await expect(page.locator('[data-media-slot="home.feature.fabric-blue"]')).toHaveAttribute("src","/generated/home-feature-fabric-blue-v1.webp");

  const runtimeAuthorityConsumers=await page.locator("body *").evaluateAll(nodes=>nodes.flatMap(node=>{
    const element=node as HTMLElement;
    const sources=[
      element.getAttribute("src")??"",
      element.getAttribute("srcset")??"",
      element.getAttribute("style")??"",
      getComputedStyle(element).backgroundImage
    ];
    return sources.some(value=>value.includes("approved-homepage-reference"))?[element.tagName+"."+element.className]:[];
  }));
  expect(runtimeAuthorityConsumers).toEqual([]);
});

test("D-062 finalizes the Selected Work color grade",async({page})=>{
  await page.setViewportSize({width:1024,height:1536});await page.goto("/en");await page.evaluate(()=>document.fonts.ready);
  const candidates=[
    {name:"current",filter:"brightness(.50) saturate(.70) contrast(1.05)"},
    {name:"s50",filter:"brightness(.50) saturate(.50) contrast(1.05)"},
    {name:"s60",filter:"brightness(.50) saturate(.60) contrast(1.05)"},
    {name:"s80",filter:"brightness(.50) saturate(.80) contrast(1.05)"},
    {name:"s90",filter:"brightness(.50) saturate(.90) contrast(1.05)"},
    {name:"c90",filter:"brightness(.50) saturate(.70) contrast(.90)"},
    {name:"c95",filter:"brightness(.50) saturate(.70) contrast(.95)"},
    {name:"c100",filter:"brightness(.50) saturate(.70) contrast(1)"},
    {name:"c110",filter:"brightness(.50) saturate(.70) contrast(1.10)"},
    {name:"soft-muted",filter:"brightness(.50) saturate(.60) contrast(.95)"}
  ];const cards=page.locator(".approved-work-image");const results:{name:string;meanAbsChannel:number;pctPixelsOver48:number}[]=[];
  for(const candidate of candidates){for(let i=0;i<await cards.count();i++)await cards.nth(i).evaluate((node,value)=>{(node as HTMLElement).style.filter=value;},candidate.filter);const shot=(await page.screenshot({fullPage:true})).toString("base64");const metric=await page.evaluate(async({shot})=>{const load=(url:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=url;});const [actual,reference]=await Promise.all([load(`data:image/png;base64,${shot}`),load("/authority/approved-homepage-reference.webp")]);const width=512,height=768,canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;const ctx=canvas.getContext("2d",{willReadFrequently:true})!;ctx.drawImage(actual,0,0,width,height);const ap=ctx.getImageData(0,0,width,height).data;ctx.clearRect(0,0,width,height);ctx.drawImage(reference,0,0,width,height);const rp=ctx.getImageData(0,0,width,height).data;let abs=0,over48=0,pixels=0;for(let i=0;i<ap.length;i+=4){const d=(Math.abs(ap[i]-rp[i])+Math.abs(ap[i+1]-rp[i+1])+Math.abs(ap[i+2]-rp[i+2]))/3;abs+=d;pixels++;if(d>48)over48++;}return{meanAbsChannel:abs/pixels,pctPixelsOver48:over48/pixels};},{shot});results.push({name:candidate.name,...metric});}
  results.sort((l,r)=>l.meanAbsChannel-r.meanAbsChannel);console.log("D062_SELECTED_WORK_COLOR_SWEEP",JSON.stringify(results));writeFileSync("artifacts/d062-selected-work-color-sweep.json",JSON.stringify(results,null,2));expect(results).toHaveLength(candidates.length);
});

test("D-062 controls have real outcomes and the carousel never fakes movement",async({page})=>{
  await page.setViewportSize({width:1024,height:768});
  await page.goto("/en");
  const rail=page.locator(".approved-industry-rail");
  const desktopOverflow=await rail.evaluate(el=>el.scrollWidth-el.clientWidth);
  expect(desktopOverflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("button",{name:"Previous"})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Next"})).toBeDisabled();

  const search=page.getByRole("button",{name:"Search"});
  await search.click();
  const searchInput=page.getByRole("textbox",{name:"What are you looking for?"});
  await expect(searchInput).toBeFocused();
  await searchInput.fill("garments");
  await expect(page.getByRole("link",{name:"Garments"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeFocused();

  const story=page.getByRole("button",{name:"Watch Our Story"});
  await story.click();
  await expect(page.getByRole("dialog",{name:"The Fares story"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(story).toBeFocused();

  const process=page.getByRole("button",{name:"Our Process"});
  await process.click();
  await expect(page.getByRole("dialog",{name:"From idea to delivery"})).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(process).toBeFocused();

  await page.setViewportSize({width:390,height:844});
  await page.reload();
  const mobileRail=page.locator(".approved-industry-rail");
  const before=Math.abs(await mobileRail.evaluate(el=>el.scrollLeft));
  await page.getByRole("button",{name:"Next"}).click();
  await expect.poll(async()=>Math.abs(await mobileRail.evaluate(el=>el.scrollLeft))).toBeGreaterThan(before);

  await expect(page.getByRole("link",{name:/Explore Our Industries/i})).toHaveAttribute("href","#industries");
  await expect(page.getByRole("link",{name:/Get in Touch/i}).first()).toHaveAttribute("href","/en/enquiry");
});

test("D-062 semantic structure, image stability and console health are production-safe",async({page})=>{
  const consoleErrors:string[]=[];
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});
  await page.goto("/en");
  await expect(page.locator(".approved-homepage > header")).toHaveCount(1);
  await expect(page.locator(".approved-homepage > main#main-content")).toHaveCount(1);
  await expect(page.locator(".approved-homepage > footer")).toHaveCount(1);
  await expect(page.locator("main .approved-home-header, main .approved-home-footer")).toHaveCount(0);
  await expect(page.getByRole("link",{name:"About"}).first()).toHaveAttribute("href","#about");
  await expect(page.locator("#about")).toHaveClass(/approved-feature-more/);
  const images=page.locator(".approved-homepage img");
  for(let index=0;index<await images.count();index++){
    await expect(images.nth(index)).toHaveAttribute("width",/\d+/);
    await expect(images.nth(index)).toHaveAttribute("height",/\d+/);
  }
  await page.getByRole("link",{name:"Skip to content"}).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  expect(consoleErrors).toEqual([]);
});

test("D-062 tablet and wide-desktop frames never clip or drift left",async({page})=>{
  for(const width of [900,1024,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto("/en");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const frame=await page.getByTestId("approved-homepage").boundingBox();
    expect(frame).not.toBeNull();
    expect(Math.round(frame?.width??0)).toBe(Math.min(width,1024));
    expect(Math.round(frame?.x??0)).toBe(width>1024?Math.round((width-1024)/2):0);
  }
  await page.setViewportSize({width:900,height:900});
  await page.goto("/en");
  await expect(page.getByRole("button",{name:"Open menu"})).toBeVisible();
});

test("D-062 English mobile reflows without changing identity",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/en");
  await expect(page.getByRole("heading",{level:1})).toContainText("PEOPLE");
  await expect(page.locator(".approved-industry-card")).toHaveCount(6);

  const trigger=page.getByRole("button",{name:"Open menu"});
  await trigger.click();
  const menu=page.getByRole("dialog",{name:"Site menu"});
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button",{name:"Close menu"})).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link",{name:/Get in Touch/i})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await page.evaluate(()=>window.scrollTo(0,1200));
  await expect.poll(async()=>Math.round((await page.locator(".approved-home-header").boundingBox())?.y??-1)).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:"artifacts/d062-homepage-mobile-en.png",fullPage:true});
});

test("D-062 Arabic preserves component inventory in RTL",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir","rtl");
  await expect(page.getByRole("heading",{level:1})).toContainText("أشخاص");
  await expect(page.locator(".approved-industry-card")).toHaveCount(6);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:"artifacts/d062-homepage-mobile-ar.png",fullPage:true});
});

test("D-062 reduced motion preserves hierarchy",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/en");
  for(const id of ["H01.01","H02.01","H04.01","H05.02"]){
    await expect(page.locator(`[data-component-id="${id}"]`)).toBeVisible();
  }
  await page.screenshot({path:"artifacts/d062-homepage-reduced-motion.png",fullPage:true});
});

test("deep routes remain reachable outside D-062 homepage authority",async({page})=>{
  await page.goto("/en/work");
  await expect(page.getByRole("heading",{level:1,name:/KGC/i})).toBeVisible();
  await page.goto("/en/garments");
  await expect(page.locator('img[src*="high-summer-polo-front.png"]')).toBeVisible();
  await page.goto("/en/enquiry");
  await expect(page.getByRole("button",{name:/Preview submission state/i})).toBeVisible();
});
