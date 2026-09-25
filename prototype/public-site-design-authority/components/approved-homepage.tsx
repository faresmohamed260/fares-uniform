"use client";

import {
  BriefcaseBusiness, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  Factory, Globe2, GraduationCap, Handshake, HardHat, Layers3,
  Menu, Ruler, Search, ShieldCheck, Shirt, Sparkles, UsersRound, Utensils, X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import { BrandWordmark } from "./brand-wordmark";

function useFocusTrap(open:boolean,onClose:()=>void,container:React.RefObject<HTMLElement|null>){
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const priorOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const focusable=()=>Array.from(container.current?.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )??[]).filter(element=>!element.hasAttribute("hidden"));
    const focusFrame=requestAnimationFrame(()=>{
      const preferred=container.current?.querySelector<HTMLElement>("[data-autofocus]");
      (preferred??focusable()[0])?.focus();
    });
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){event.preventDefault();onClose();return;}
      if(event.key!=="Tab")return;
      const items=focusable();
      if(items.length===0){event.preventDefault();return;}
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    window.addEventListener("keydown",onKeyDown);
    return()=>{
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow=priorOverflow;
      window.removeEventListener("keydown",onKeyDown);
      previous?.focus();
    };
  },[open]);
}

function useHomepageSignatureMotion(){
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>(".approved-homepage");
    if(!root)return;
    const hero=root.querySelector<HTMLElement>(".approved-hero");
    const industries=root.querySelector<HTMLElement>(".approved-industries");
    const feature=root.querySelector<HTMLElement>(".approved-feature-band");
    const closing=root.querySelector<HTMLElement>(".approved-closing-cta");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0;

    const clamp=(value:number)=>Math.min(1,Math.max(0,value));
    const update=()=>{
      frame=0;
      const viewport=Math.max(window.innerHeight,1);
      const isReduced=reduced.matches;

      if(hero){
        const rect=hero.getBoundingClientRect();
        const p=isReduced?0:clamp(-rect.top/Math.max(rect.height*.72,1));
        hero.style.setProperty("--hero-handoff",p.toFixed(4));
        hero.style.setProperty("--hero-seam-scale",p.toFixed(4));
        hero.style.setProperty("--hero-copy-lift",`${(-58*p).toFixed(1)}px`);
        hero.style.setProperty("--hero-copy-opacity",(1-p*.78).toFixed(4));
        hero.style.setProperty("--hero-people-scale",(1+p*.12).toFixed(4));
        hero.style.setProperty("--hero-people-y",`${(-54*p).toFixed(1)}px`);
      }

      if(industries){
        const rect=industries.getBoundingClientRect();
        const p=isReduced?1:clamp((viewport-rect.top)/(viewport*.9));
        industries.style.setProperty("--industries-enter",p.toFixed(4));
        industries.style.setProperty("--industries-seam-y",`${(-22*p).toFixed(1)}px`);
      }

      if(feature){
        const rect=feature.getBoundingClientRect();
        const travel=Math.max(rect.height-viewport,1);
        const p=isReduced?.5:clamp(-rect.top/travel);
        feature.style.setProperty("--feature-progress",p.toFixed(4));


        feature.style.setProperty("--feature-fabric-scale",(1.04+p*.13).toFixed(4));
        feature.style.setProperty("--feature-process-scale",(1.08-p*.08).toFixed(4));
      }

      if(closing){
        const rect=closing.getBoundingClientRect();
        const p=isReduced?1:clamp((viewport-rect.top)/(viewport+rect.height*.45));
        closing.style.setProperty("--cta-progress",p.toFixed(4));
        closing.style.setProperty("--cta-dash",(1-p).toFixed(4));
        closing.style.setProperty("--cta-grid-y",`${((1-p)*38).toFixed(1)}px`);
      }
    };
    const schedule=()=>{
      if(frame)return;
      frame=requestAnimationFrame(update);
    };
    const observer=new ResizeObserver(schedule);
    [hero,industries,feature,closing].forEach(element=>element&&observer.observe(element));
    update();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    reduced.addEventListener("change",schedule);
    return()=>{
      if(frame)cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      reduced.removeEventListener("change",schedule);
    };
  },[]);
}

function ApprovedDialog({open,onClose,id,title,closeLabel,children}:{open:boolean;onClose:()=>void;id:string;title:string;closeLabel:string;children:React.ReactNode}){
  const panel=useRef<HTMLDivElement>(null);
  useFocusTrap(open,onClose,panel);
  if(!open)return null;
  return <div className="approved-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <div ref={panel} className="approved-dialog" role="dialog" aria-modal="true" aria-labelledby={id}>
      <div className="approved-dialog-head"><h2 id={id}>{title}</h2><button type="button" aria-label={closeLabel} onClick={onClose}><X aria-hidden="true"/></button></div>
      {children}
    </div>
  </div>;
}

function BrandLockup(){
  return <span className="approved-brand"><BrandWordmark /></span>;
}

const navLinks=[
  ["Home","الرئيسية","#top"],["Industries","القطاعات","#industries"],["Collections","المجموعات","/garments"],
  ["Our Process","عمليتنا","#process"],["About","عن فارس","#about"],["Work","أعمالنا","/work"],["Contact","اتصل بنا","/enquiry"],
] as const;

export function ApprovedHomepageHeader({locale}:{locale:Locale}){
  const [open,setOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const menu=useRef<HTMLDivElement>(null);
  const ar=locale==="ar";
  useFocusTrap(open,()=>setOpen(false),menu);
  const href=(raw:string)=>raw.startsWith("#")?raw:`/${locale}${raw}`;
  const searchItems=[
    ...navLinks.map(([en,arabic,raw])=>({en,ar:arabic,href:href(raw),keywords:raw})),
    {en:"Garments",ar:"الملابس",href:`/${locale}/garments`,keywords:"products catalog collections"},
    {en:"Enquiry",ar:"طلب تواصل",href:`/${locale}/enquiry`,keywords:"contact quote project"},
  ].filter(item=>`${item.en} ${item.ar} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <header className="approved-home-header" data-section-id="H00" data-testid="approved-h00">
    <a href={`/${locale}`} className="approved-header-brand" data-component-id="H00.01" aria-label="Fares Uniform home"><BrandLockup/></a>
    <nav className="approved-header-nav" data-component-id="H00.02" aria-label={ar?"التنقل الرئيسي":"Primary navigation"}>
      {navLinks.map(([en,arabic,raw],i)=><a key={en} className={i===0?"is-active":""} aria-current={i===0?"page":undefined} href={href(raw)}>{ar?arabic:en}</a>)}
    </nav>
    <div className="approved-header-utilities">
      <button className="approved-icon-button" data-component-id="H00.03" type="button" aria-label={ar?"بحث":"Search"} aria-haspopup="dialog" onClick={()=>setSearchOpen(true)}><Search aria-hidden="true"/></button>
      <a className="approved-locale" data-component-id="H00.04" href={ar?"/en":"/ar"} lang={ar?"en":"ar"} aria-label={ar?"Switch to English":"التبديل إلى العربية"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
      <a className="approved-header-cta" data-component-id="H00.05" href={`/${locale}/enquiry`}><span>{ar?"تواصل معنا":"Get in Touch"}</span><i>↗</i></a>
    </div>
    <button className="approved-mobile-trigger" type="button" aria-label={ar?"فتح القائمة":"Open menu"} aria-expanded={open} aria-haspopup="dialog" onClick={()=>setOpen(true)}><Menu aria-hidden="true"/></button>
    {open&&<div ref={menu} className="approved-mobile-menu" role="dialog" aria-modal="true" aria-label={ar?"قائمة الموقع":"Site menu"}>
      <div><BrandLockup/><button data-autofocus type="button" aria-label={ar?"إغلاق القائمة":"Close menu"} onClick={()=>setOpen(false)}><X aria-hidden="true"/></button></div>
      <nav>{navLinks.map(([en,arabic,raw])=><a key={en} onClick={()=>setOpen(false)} href={href(raw)}>{ar?arabic:en}</a>)}</nav>
      <a href={`/${locale}/enquiry`} onClick={()=>setOpen(false)}>{ar?"تواصل معنا":"Get in Touch"} <span aria-hidden="true">↗</span></a>
    </div>}
    <ApprovedDialog open={searchOpen} onClose={()=>setSearchOpen(false)} id="approved-search-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"ابحث في الموقع":"Search the site"}>
      <label className="approved-search-field"><span>{ar?"ماذا تبحث عنه؟":"What are you looking for?"}</span><input data-autofocus value={query} onChange={event=>setQuery(event.target.value)} placeholder={ar?"القطاعات أو الملابس أو التواصل":"Industries, garments, or contact"}/></label>
      <nav className="approved-search-results" aria-label={ar?"نتائج البحث":"Search results"}>
        {searchItems.length>0?searchItems.map(item=><a key={`${item.en}-${item.href}`} href={item.href} onClick={()=>setSearchOpen(false)}>{ar?item.ar:item.en}<span aria-hidden="true">↗</span></a>):<p role="status">{ar?"لا توجد نتائج.":"No matching pages."}</p>}
      </nav>
    </ApprovedDialog>
  </header>;
}

export function ApprovedHero({locale}:{locale:Locale}){
  const ar=locale==="ar";

  const [scene,setScene]=useState(0);
  const [heroPaused,setHeroPaused]=useState(false);
  useEffect(()=>{
    if(heroPaused)return;
    const timer=window.setInterval(()=>{
      if(document.visibilityState==="visible"&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        setScene(current=>(current+1)%3);
      }
    },5500);
    return()=>window.clearInterval(timer);
  },[scene,heroPaused]);
  const notes=ar?["أدوار مختلفة\nهوية واحدة","من الفكرة\nإلى الباترون","قصّ. خياطة.\nتشطيب."]:["Different roles.\nOne identity.","From brief\nto pattern.","Cut. Sew.\nFinish."];
  const peopleNote=ar?"لمن يرتدون\nالزي كل يوم":"For the people\nwho wear it.";
  const benefits=[
    [Shirt,ar?"خامات عالية الجودة":"Quality Materials"],
    [UsersRound,ar?"موثوق به من الشركات":"Trusted by Businesses"],
    [Factory,ar?"إنتاج داخلي":"In-House Production"],
    [Handshake,ar?"شراكات طويلة الأمد":"Long-Term Partnerships"],
  ] as const;
  return <section id="top" className="approved-hero" data-sc-act="flow" data-sc-drift="#ffffff" data-section-id="H01" data-testid="approved-h01" data-hero-scene={scene} onFocusCapture={()=>setHeroPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setHeroPaused(false)}}>
    <div className="approved-hero-copy" data-sc-in data-sc-stagger="55">
      <span className="approved-hero-descriptor" data-component-id="H01.01">{ar?"تصميم وتصنيع الزي الموحّد":"UNIFORM DESIGN & MANUFACTURING"}</span>
      <h1 className="approved-brand-headline" data-component-id="H01.02" aria-label={ar?"فارس يونيفورم":"Fares Uniform"}><span>FARES</span><span>UNIFORM</span></h1>
      <p className="approved-hero-tagline">{ar?"أشخاص. شركات. مجتمعات.":"People. Businesses. Communities."}</p>
      <p className="approved-hero-description" data-component-id="H01.03">{ar?"نصمّم ونصنّع أزياء موحّدة للمدارس والضيافة والرعاية الصحية والشركات وغيرها — لنساعد الناس على الظهور بمظهر مهني، والشعور بالثقة، والتقدّم معاً.":"We design and manufacture uniforms for schools, hospitality, healthcare, corporate and more — helping people look professional, feel confident, and move forward together."}</p>
      <div className="approved-hero-actions">
        <a data-component-id="H01.04" className="approved-primary-button" href="#industries"><span>{ar?"استكشف القطاعات":"Explore Industries"}</span><i aria-hidden="true">↗</i></a>
        <a data-component-id="H01.05" className="approved-story-button" href="#process"><span><ChevronRight aria-hidden="true"/></span>{ar?"اكتشف مراحل عملنا":"See Our Process"}</a>
      </div>
      <div className="approved-hero-benefits" data-component-id="H01.11" aria-label={ar?"مزايا فارس":"Fares benefits"}>
        {benefits.map(([Icon,label])=><div key={label}><Icon aria-hidden="true"/><span>{label}</span></div>)}
      </div>
      <div className="approved-hero-pagination" data-component-id="H01.06" aria-label={ar?"مشاهد المقدمة":"Hero scenes"}>
        <button type="button" aria-label={ar?"عرض المشهد الأول: أشخاص في زي موحّد":"Show scene 1: People in uniform"} aria-current={scene===0?"step":undefined} onClick={()=>setScene(0)}>01</button><i aria-hidden="true"/>
        <button type="button" aria-label={ar?"عرض المشهد الثاني: التصميم والقص":"Show scene 2: Design and cutting"} aria-current={scene===1?"step":undefined} onClick={()=>setScene(1)}>02</button><i aria-hidden="true"/>
        <button type="button" aria-label={ar?"عرض المشهد الثالث: التصنيع والتشطيب":"Show scene 3: Manufacturing and finishing"} aria-current={scene===2?"step":undefined} onClick={()=>setScene(2)}>03</button>
      </div>
    </div>
    <div className="approved-hero-media">
      <div className="approved-hero-background-plane" data-component-id="H01.07" data-sc-parallax="-0.22" aria-hidden="true"><img data-media-slot="home.hero.architecture" src="/generated/home-hero-architecture-courtyard-v2.png" width={1672} height={941} alt=""/></div>
            <div className={"approved-hero-scene-plane"+(scene===1?" is-active":"")} aria-hidden="true"><img data-media-slot="home.hero.design-cutting" src="/generated/home-hero-design-cutting-v1.png" width={1672} height={941} alt=""/></div>
      <div className={"approved-hero-scene-plane"+(scene===2?" is-active":"")} aria-hidden="true"><img data-media-slot="home.hero.manufacturing" src="/generated/home-hero-manufacturing-v1.png" width={1672} height={941} alt=""/></div>
      <div className="approved-hero-geometry-plane" data-sc-parallax="-1.35"><div className="approved-blue-geometry" data-component-id="H01.08" aria-hidden="true"><span/><span/></div></div>
      <div className="approved-hero-people-plane" data-sc-parallax="-0.62"><img data-media-slot="home.hero.people-group" className="approved-hero-people approved-hero-generated" src="/generated/home-hero-people-sharp-v4.png" width={1672} height={941} fetchPriority="high" decoding="async" alt={ar?"تكوين توضيحي عام لطالبة ومتخصصة رعاية صحية وطاهٍ وعامل صناعي":"Generic illustrative group of a student, healthcare professional, chef and industrial worker"}/></div>
      <div className="approved-hand-note note-a" data-component-id="H01.09" data-sc-parallax="0.34">{notes[scene]}<svg viewBox="0 0 90 44"><path d="M3 8c25 5 45 14 72 27m-12-14 13 14-17 3"/></svg></div>
      <div className={"approved-hand-note note-b"+(scene===0?"":" is-scene-hidden")} aria-hidden={scene!==0} data-component-id="H01.10" data-sc-parallax="0.48">{peopleNote}<svg viewBox="0 0 88 46"><path d="M83 7C60 15 44 27 10 35m9-12L9 35l15 4"/></svg></div>
      <div className="approved-hero-seam" aria-hidden="true"><span/><span/></div>
    </div>
  </section>;
}

const industries=[
 {key:"education",en:"Education",ar:"التعليم",sub:"SCHOOL UNIFORMS",subAr:"الزي المدرسي",summary:"A considered uniform identity for every school day.",summaryAr:"هوية زي موحّد مدروسة لكل يوم دراسي.",Icon:GraduationCap},
 {key:"hospitality",en:"Hospitality",ar:"الضيافة",sub:"HOTELS & GUEST TEAMS",subAr:"الفنادق وفرق الضيافة",summary:"A coordinated look across guest-facing roles.",summaryAr:"مظهر متناسق لفرق استقبال وخدمة الضيوف.",Icon:Utensils},
 {key:"healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"CLINICS & CARE TEAMS",subAr:"العيادات وفرق الرعاية",summary:"Clear, practical identity for care environments.",summaryAr:"هوية واضحة وعملية لبيئات الرعاية.",Icon:CirclePlus},
 {key:"corporate",en:"Corporate",ar:"الشركات",sub:"OFFICES & BUSINESS",subAr:"المكاتب والأعمال",summary:"One professional expression across the team.",summaryAr:"مظهر مهني موحّد لفريق العمل.",Icon:BriefcaseBusiness},
 {key:"industrial",en:"Industrial",ar:"الصناعي",sub:"OPERATIONAL WORKWEAR",subAr:"ملابس العمل",summary:"Workwear considered around the job and the people doing it.",summaryAr:"ملابس عمل تراعي طبيعة المهام والأشخاص الذين يؤدونها.",Icon:HardHat},
 {key:"security",en:"Security",ar:"الأمن",sub:"SECURITY TEAMS",subAr:"فرق الأمن",summary:"A consistent identity for visible operational roles.",summaryAr:"هوية متسقة للأدوار الميدانية الظاهرة.",Icon:ShieldCheck},
] as const;

export function ApprovedIndustries({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const [active,setActive]=useState(0);
 const selected=industries[active];
 const selectWithArrow=(event:React.KeyboardEvent<HTMLButtonElement>,index:number)=>{
  const step=event.key==="ArrowDown"||event.key==="ArrowRight"?1:event.key==="ArrowUp"||event.key==="ArrowLeft"?-1:0;
  if(!step)return;
  event.preventDefault();
  const next=(index+step+industries.length)%industries.length;
  setActive(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(".approved-sector-option")[next]?.focus();
 };
 return <section id="industries" className="approved-industries" data-sc-act="flow" data-sc-drift="#f5f8fb" data-section-id="H02" data-testid="approved-h02">
   <div className="approved-industries-entry-seam" aria-hidden="true"><span/><span/></div>
   <div className="approved-industries-layout">
    <div className="approved-industries-content" data-sc-in data-sc-stagger="70">
     <header className="approved-industries-head">
      <span className="approved-eyebrow" data-component-id="H02.01">{ar?"قطاعاتنا":"OUR INDUSTRIES"}</span>
      <h2 data-component-id="H02.02">{ar?"حلول زي موحّد":"Uniform Solutions"}<br/><em>{ar?"لكل قطاع":"for Every Sector"}</em></h2>
      <p data-component-id="H02.03">{ar?"هوية موحّدة تراعي اختلاف الأدوار وبيئات العمل، من التعليم إلى الضيافة والرعاية وما بعدها.":"A shared identity, considered for different roles and environments. From education to hospitality, care and beyond."}</p>
     </header>
     <div className="approved-sector-selector" data-component-id="H02.05" aria-label={ar?"اختر القطاع":"Choose an industry"}>
      {industries.map((sector,index)=><button key={sector.key} type="button" className={`approved-sector-option${index===active?" is-active":""}`} aria-pressed={index===active} aria-controls="approved-industry-stage" onClick={()=>setActive(index)} onPointerEnter={event=>{if(event.pointerType==="mouse")setActive(index);}} onFocus={()=>setActive(index)} onKeyDown={event=>selectWithArrow(event,index)}>
       <span className="approved-sector-number">{String(index+1).padStart(2,"0")}</span><span>{ar?sector.ar:sector.en}</span><span className="approved-sector-option-line" aria-hidden="true"/>
      </button>)}
     </div>
    </div>
    <div className="approved-industry-stage" id="approved-industry-stage" data-component-id="H02.06" data-sc-in data-sc-stagger="65">
     <div className="approved-industry-art" aria-hidden="false">
      {industries.map(({key,en,ar:arabic,Icon},index)=><div key={key} data-media-slot={`home.industries.${key}`} className={`approved-industry-scene sector-${key}${index===active?" is-active":""}`} role="img" aria-label={ar?`رسم توضيحي تجريدي لقطاع ${arabic}`:`Abstract graphic environment for ${en}`} aria-hidden={index!==active}>
       <span className="approved-scene-grid" aria-hidden="true"/><span className="approved-scene-band" aria-hidden="true"/><span className="approved-scene-disc" aria-hidden="true"/>
       <svg className="approved-scene-lines" viewBox="0 0 720 700" preserveAspectRatio="none" aria-hidden="true"><path d="M-60 550 C120 475 160 160 360 175 S620 540 780 190"/><path d="M-30 300 C150 40 330 250 455 340 S650 460 760 350"/></svg>
       <Icon className="approved-scene-symbol" aria-hidden="true"/>
      </div>)}
     </div>
     <div className="approved-industry-stage-copy" aria-live="polite">
      <span className="approved-stage-kicker">{ar?"مصمم للناس":"DESIGNED FOR PEOPLE"}</span>
      <h3>{ar?selected.ar:selected.en}</h3>
      <p>{ar?selected.summaryAr:selected.summary}</p>
      <a data-component-id="H02.04" href={`/${locale}/work`}>{ar?"استكشف أعمالنا":"Explore Our Work"} <ChevronRight aria-hidden="true"/></a>
     </div>
    </div>
   </div>
 </section>;
}

export function ApprovedFeatureBand({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const [processOpen,setProcessOpen]=useState(false);
 const steps=ar?["تصميم","عينة","إنتاج","تسليم"]:["Design","Sample","Produce","Deliver"];
 return <section id="process" className="approved-feature-band" data-sc-act="pin" data-sc-span="1.55" data-sc-dwell="0.1" data-sc-drift="#0b213e" data-section-id="H03" data-testid="approved-h03">
  <div className="approved-feature-stage" data-sc-stage>
   <article id="about" className="approved-feature-more">
    <div className="approved-fabric-plane" data-sc-parallax="-0.45"><img className="approved-fabric-field" data-component-id="H03A.01" data-media-slot="home.feature.fabric-blue" src="/generated/home-feature-fabric-blue-v1.webp" width={996} height={526} loading="lazy" decoding="async" alt="" aria-hidden="true"/></div>
    <div className="approved-feature-copy">
     <h2 data-component-id="H03A.02">{ar?"أكثر من\nزي موحّد":"MORE THAN\nUNIFORMS"}</h2>
     <p data-component-id="H03A.03">{ar?"أقمشة عالية الجودة، تصميم عملي وإنتاج موثوق — زي يعمل بجد مثل من يرتديه.":"Quality fabrics, practical design and reliable production — uniforms that work as hard as the people wearing them."}</p>
     <a data-component-id="H03A.04" className="approved-light-button" href={`/${locale}/garments`}>{ar?"اكتشف مجموعاتنا":"Discover Our Collections"} <ChevronRight aria-hidden="true"/></a>
    </div>
   </article>
   <article className="approved-feature-idea">
    <div className="approved-sketch-plane"><img data-media-slot="home.feature.design-sketch" className="approved-sketch-background approved-sketch-generated" src="/generated/home-feature-design-sketch.svg" width={519} height={263} loading="lazy" decoding="async" alt="" aria-hidden="true"/></div>
    <div className="approved-sketch-mask" aria-hidden="true"/>
    <div className="approved-feature-copy approved-feature-copy-dark">
     <h2 data-component-id="H03B.02">{ar?"من الفكرة\nإلى الزي":"FROM IDEA\nTO UNIFORM"}</h2>
     <p data-component-id="H03B.03">{ar?"من الفكرة إلى المنتج النهائي — نصمّم ونأخذ العينات ونصنّع الزي الذي يحوّل رؤيتك إلى واقع.":"Concept to final product — designing, sampling and manufacturing uniforms that bring your vision to life."}</p>
     <ol className="approved-process-timeline" data-component-id="H03B.04" aria-label={ar?"مراحل العمل":"Process stages"}>{steps.map((label,index)=><li key={label}><span aria-hidden="true"/><strong>{label}</strong><small className="sr-only">{index+1} / 4</small></li>)}</ol>
     <button data-component-id="H03B.06" className="approved-outline-button" type="button" aria-haspopup="dialog" onClick={()=>setProcessOpen(true)}>{ar?"عمليتنا":"Our Process"} <ChevronRight aria-hidden="true"/></button>
    </div>
   </article>
   <div className="approved-seam-handoff" aria-hidden="true"/>
  </div>
  <ApprovedDialog open={processOpen} onClose={()=>setProcessOpen(false)} id="approved-process-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"من الفكرة إلى التسليم":"From idea to delivery"}>
    <ol className="approved-process-detail">{[
      [ar?"١":"01",ar?"التصميم":"Design",ar?"نحوّل المتطلبات والهوية إلى اتجاه واضح.":"We translate requirements and identity into a clear direction."],
      [ar?"٢":"02",ar?"العينة":"Sample",ar?"نراجع الخامة والمقاس والتفاصيل قبل الإنتاج.":"We validate fabric, fit, and details before production."],
      [ar?"٣":"03",ar?"الإنتاج":"Produce",ar?"نصنّع البرنامج المتفق عليه بجودة متسقة.":"We manufacture the agreed program with consistent quality."],
      [ar?"٤":"04",ar?"التسليم":"Deliver",ar?"ننسّق التسليم والدعم وفق احتياجات المؤسسة.":"We coordinate delivery and support around the organization’s needs."]
    ].map(([number,title,copy])=><li key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}</ol>
  </ApprovedDialog>
 </section>;
}

const workCards=[
 {slot:"home.work.kgc",en:"KGC",ar:"KGC",sub:"School Uniform Program",subAr:"برنامج زي مدرسي",href:"/work/kgc/national",kind:"real"},
 {slot:"home.work.hospitality",en:"Hospitality",ar:"الضيافة",sub:"Sector capability",subAr:"قدرات القطاع",href:"/work",kind:"hospitality"},
 {slot:"home.work.healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"Sector capability",subAr:"قدرات القطاع",href:"/work",kind:"healthcare"},
] as const;

export function ApprovedSelectedWork({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="approved-selected-work" data-sc-act="flow" data-sc-drift="#ffffff" data-section-id="H04" data-testid="approved-h04">
  <div className="approved-selected-title" data-sc-in data-sc-stagger="70"><span className="approved-eyebrow" data-component-id="H04.01">{ar?"أعمال مختارة":"SELECTED WORK"}</span><h2 data-component-id="H04.02">{ar?"شراكات حقيقية.\nنتائج حقيقية.":"Real Partnerships.\nReal Results."}</h2></div>
  <div className="approved-work-cards" data-sc-in data-sc-stagger="75">{workCards.map((c,i)=><a className={`approved-work-card work-${c.kind}`} data-sc-tilt="4" key={c.slot} href={`/${locale}${c.href}`} aria-label={c.kind==="real"?(ar?"مشروع KGC":"KGC project"):(ar?`${c.ar}، لوحة قدرات رسومية`:`${c.en}, graphic capability panel`)} data-component-id={`H04.0${i+3}`}>{c.kind==="real"
   ? <img data-media-slot={c.slot} className="approved-work-image approved-work-real" src="/review-media/kgc/kgc-building.webp" width={169} height={149} loading="lazy" decoding="async" alt={ar?"حرم KGC في بيئة المراجعة المحمية":"KGC campus in the protected review environment"}/>
   : <div data-media-slot={c.slot} className={`approved-work-capability capability-${c.kind}`} role="img" aria-label={ar?`تكوين رسومي توضيحي لقدرات ${c.ar}`:`Graphic capability field for ${c.en}`}>
      <span className="approved-capability-kicker">{ar?"قدرات":"CAPABILITY"}</span>
      <svg viewBox="0 0 420 520" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 410 125 268 240 316 450 92"/><path d="M-40 198 98 82 226 158 462 32"/><circle cx="315" cy="358" r="86"/></svg>
      {c.kind==="hospitality"?<Utensils aria-hidden="true"/>:<CirclePlus aria-hidden="true"/>}
     </div>}<div className="approved-work-meta"><strong>{ar?c.ar:c.en}</strong><span>{ar?c.subAr:c.sub}</span><i>↗</i></div></a>)}
   <a className="approved-work-cta" data-component-id="H04.06" href={`/${locale}/work`} data-sc-magnet="0.22"><p>{ar?"لنصنع شيئاً رائعاً معاً.":"Let's build something great together."}</p><span>{ar?"عرض كل الأعمال":"View All Work"} ↗</span></a>
  </div>
 </section>;
}

export function ApprovedClosingCta({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="approved-closing-cta" data-sc-act="flow" data-sc-drift="#edf6fd" data-section-id="H05" data-testid="approved-h05">
  <div data-media-slot="home.cta.building" className="approved-architecture-field" role="img" aria-label={ar?"تكوين معماري رسومي توضيحي":"Graphic architectural field"}>
   <div className="approved-architecture-glow" aria-hidden="true"/>
   <svg className="approved-architecture-lines" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
    <path className="architecture-thread" pathLength="1" d="M-80 690 C180 580 314 650 498 488 S792 182 1038 292 1320 516 1688 248"/>
    <path className="architecture-thread architecture-thread-soft" pathLength="1" d="M-60 760 C252 642 380 744 628 574 S1008 340 1660 412"/>
    <path className="architecture-shell" d="M82 744V424h278V744M360 744V286h426V744M786 744V366h310V744M1096 744V238h386V744"/>
    <path className="architecture-shell" d="M118 498h206M412 362h320M830 438h220M1150 314h274"/>
   </svg>
   <div className="approved-architecture-grid" aria-hidden="true"/>
  </div>
  <div className="approved-cta-scrim" aria-hidden="true"/>
  <div className="approved-cta-copy" data-sc-cue="0.1 0.92 .18 0"><span className="approved-eyebrow" data-component-id="H05.02">{ar?"جاهز للبدء؟":"READY TO GET STARTED?"}</span><h2 data-component-id="H05.03" data-sc-kinetic="lines">{ar?"لنصنع\nحل الزي الخاص بك":"LET'S CREATE\nYOUR UNIFORM SOLUTION"}</h2><div data-component-id="H05.04"><a className="approved-primary-button" data-sc-magnet="0.24" href={`/${locale}/enquiry`}>{ar?"تواصل معنا":"Get in Touch"} ↗</a><p>{ar?"نحن هنا لمساعدتك في المتطلبات والأفكار والأسئلة.":"We're here to help with requirements, ideas, or questions."}</p></div></div>
  <div className="approved-hand-note approved-local-note" data-component-id="H05.05" data-sc-cue="0.36 1 .2 0">{ar?"جذور محلية\nمعايير عالمية":"Local Roots\nGlobal Standards"}<svg viewBox="0 0 90 42"><path d="M5 6c25 7 49 17 72 28m-14-14 15 14-18 3"/></svg></div>
 </section>;
}

export function ApprovedHomepageFooter({locale}:{locale:Locale}){
 const ar=locale==="ar";const href=(raw:string)=>raw.startsWith("#")?raw:`/${locale}${raw}`;
 return <footer className="approved-home-footer" data-section-id="H06" data-testid="approved-h06">
  <a className="approved-footer-brand" data-component-id="H06.01" href={`/${locale}`}><BrandLockup/></a>
  <nav data-component-id="H06.02" aria-label={ar?"روابط التذييل":"Footer navigation"}>{navLinks.map(([en,arabic,raw])=><a key={en} href={href(raw)}>{ar?arabic:en}</a>)}</nav>
  <div className="approved-socials" data-component-id="H06.03"><button aria-label="Instagram" disabled><span>IG</span></button><button aria-label="LinkedIn" disabled><span>in</span></button><button aria-label="Facebook" disabled><span>f</span></button><button aria-label="YouTube" disabled><span>▶</span></button></div>
  <a className="approved-footer-locale" data-component-id="H06.04" href={ar?"/en":"/ar"} lang={ar?"en":"ar"} aria-label={ar?"Switch to English":"التبديل إلى العربية"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
  <hr data-component-id="H06.05"/><small data-component-id="H06.06">© 2026 Fares Uniform. {ar?"جميع الحقوق محفوظة.":"All rights reserved."}</small><p data-component-id="H06.07">{ar?"زي موحّد لغدٍ أكثر إشراقاً.":"Uniforms for a brighter tomorrow."}</p>
 </footer>;
}

export function ApprovedHomepage({locale}:{locale:Locale}){
 useHomepageSignatureMotion();
 return <div className="approved-homepage" data-testid="approved-homepage">
  <ApprovedHomepageHeader locale={locale}/>
  <main id="main-content" tabIndex={-1}>
    <ApprovedHero locale={locale}/><ApprovedIndustries locale={locale}/><ApprovedFeatureBand locale={locale}/>
    <ApprovedSelectedWork locale={locale}/><ApprovedClosingCta locale={locale}/>
  </main>
  <ApprovedHomepageFooter locale={locale}/>
 </div>;
}
