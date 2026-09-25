"use client";

import {
  BriefcaseBusiness, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  Factory, Globe2, GraduationCap, Handshake, HardHat, Layers3,
  Menu, Play, Ruler, Search, ShieldCheck, Shirt, Sparkles, UsersRound, Utensils, X
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
        industries.style.setProperty("--industries-seam-y",`${(-150*p).toFixed(1)}px`);
        industries.style.setProperty("--industries-seam-scale",(1-p*.36).toFixed(4));
      }

      if(feature){
        const rect=feature.getBoundingClientRect();
        const travel=Math.max(rect.height-viewport,1);
        const p=isReduced?.5:clamp(-rect.top/travel);
        feature.style.setProperty("--feature-progress",p.toFixed(4));
        feature.style.setProperty("--feature-left-clip",`${(38+p*50).toFixed(2)}%`);
        feature.style.setProperty("--feature-right-clip",`${(65-p*57).toFixed(2)}%`);
        feature.style.setProperty("--feature-seam-x",`${(62-p*50).toFixed(2)}%`);
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
  const [storyOpen,setStoryOpen]=useState(false);
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
      <span className="approved-eyebrow" data-component-id="H01.01">{ar?"مصمّم لكل دور":"DESIGNED FOR EVERY ROLE"}</span>
      <h1 data-component-id="H01.02"><span>{ar?"أشخاص":"PEOPLE"}</span><span>{ar?"أعمال":"BUSINESSES"}</span><span>{ar?"مجتمعات":"COMMUNITIES"}</span><em><span>{ar?"في":"IN"}</span><span>{ar?"الزي الموحّد":"UNIFORM"}</span></em></h1>
      <p data-component-id="H01.03">{ar?"نصمّم ونصنّع أزياء موحّدة متناسقة للمدارس والضيافة والرعاية الصحية والشركات، انطلاقاً من هوية كل مؤسسة وأدوار العاملين فيها.":"We design and manufacture coordinated uniforms for schools, hospitality, healthcare and businesses — shaped around the people, roles and identity of each organization."}</p>
      <div className="approved-hero-actions">
        <a data-component-id="H01.04" className="approved-primary-button" href="#industries">{ar?"استكشف قطاعاتنا":"Explore Our Industries"} <i>↗</i></a>
        <button data-component-id="H01.05" className="approved-story-button" type="button" aria-haspopup="dialog" onClick={()=>setStoryOpen(true)}><span><Play fill="currentColor" aria-hidden="true"/></span>{ar?"شاهد قصتنا":"Watch Our Story"}</button>
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
    <ApprovedDialog open={storyOpen} onClose={()=>setStoryOpen(false)} id="approved-story-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"قصة فارس":"The Fares story"}>
      <div className="approved-dialog-copy"><p>{ar?"نحوّل هوية المؤسسات إلى برامج زي عملية ومتناسقة، من التصميم وأخذ العينات إلى التصنيع والتسليم.":"We translate an organization’s identity into practical, coordinated uniform programs, from design and sampling through manufacturing and delivery."}</p><a className="approved-primary-button" href={`/${locale}/enquiry`} onClick={()=>setStoryOpen(false)}>{ar?"ابدأ مشروعك":"Start a project"} <span aria-hidden="true">↗</span></a></div>
    </ApprovedDialog>
  </section>;
}

const industries=[
 {key:"education",en:"Education",ar:"التعليم",sub:"SCHOOL UNIFORMS",subAr:"زي مدرسي",Icon:GraduationCap},
 {key:"hospitality",en:"Hospitality",ar:"الضيافة",sub:"HOTELS & RESTAURANTS",subAr:"فنادق ومطاعم",Icon:Utensils},
 {key:"healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"HOSPITALS & CLINICS",subAr:"مستشفيات وعيادات",Icon:CirclePlus},
 {key:"corporate",en:"Corporate",ar:"الشركات",sub:"BUSINESS & OFFICES",subAr:"أعمال ومكاتب",Icon:BriefcaseBusiness},
 {key:"industrial",en:"Industrial",ar:"الصناعي",sub:"WORKWEAR & SAFETY",subAr:"ملابس عمل وسلامة",Icon:HardHat},
 {key:"security",en:"Security",ar:"الأمن",sub:"SECURITY UNIFORMS",subAr:"زي أمني",Icon:ShieldCheck},
] as const;

export function ApprovedIndustries({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const rail=useRef<HTMLDivElement>(null);
 const [railState,setRailState]=useState({canPrevious:false,canNext:false});
 useEffect(()=>{
  const element=rail.current;if(!element)return;
  const update=()=>{const max=Math.max(0,element.scrollWidth-element.clientWidth);const position=Math.abs(element.scrollLeft);setRailState({canPrevious:position>1,canNext:position<max-1});};
  update();element.addEventListener("scroll",update,{passive:true});
  const observer=new ResizeObserver(update);observer.observe(element);
  return()=>{element.removeEventListener("scroll",update);observer.disconnect();};
 },[]);
 const move=(dir:number)=>rail.current?.scrollBy({left:(ar?-dir:dir)*Math.max(190,rail.current.clientWidth*.72),behavior:"smooth"});
 return <section id="industries" className="approved-industries" data-sc-act="flow" data-sc-drift="#f5f8fb" data-section-id="H02" data-testid="approved-h02">
   <div className="approved-industries-entry-seam" aria-hidden="true"><span/><span/></div>
   <header className="approved-industries-head" data-sc-in data-sc-stagger="70">
    <div><span className="approved-eyebrow" data-component-id="H02.01">{ar?"قطاعاتنا":"OUR INDUSTRIES"}</span><h2 data-component-id="H02.02">{ar?"حلول زي موحّد":"Uniform Solutions"}<br/><em>{ar?"لكل قطاع":"for Every Sector"}</em></h2></div>
    <div className="approved-industries-intro"><p data-component-id="H02.03">{ar?"من الفصول إلى المطابخ، ومن المستشفيات إلى الفنادق — نصنع حلول زي تناسب فريقك وعلامتك وعملك اليومي.":"From classrooms to kitchens, hospitals to hotels — we create uniform solutions that fit your people, your brand, and your day-to-day needs."}</p>
      <a data-component-id="H02.04" href={`/${locale}/work`}>{ar?"عرض كل القطاعات":"View All Industries"} <i>↗</i></a>
      <div data-component-id="H02.05" className="approved-carousel-controls"><button type="button" aria-label={ar?"السابق":"Previous"} disabled={!railState.canPrevious} onClick={()=>move(-1)}><ChevronLeft aria-hidden="true"/></button><button type="button" aria-label={ar?"التالي":"Next"} disabled={!railState.canNext} onClick={()=>move(1)}><ChevronRight aria-hidden="true"/></button></div>
    </div>
   </header>
   <div className="approved-industry-rail" ref={rail} data-component-id="H02.06" data-sc-in data-sc-stagger="65">{industries.map(({key,en,ar:arabic,sub,subAr,Icon},index)=><article className={`approved-industry-card sector-${key}`} data-sc-tilt="5" key={key}>
    <div data-media-slot={`home.industries.${key}`} className="approved-sector-visual" role="img" aria-label={ar?`تكوين رسومي توضيحي لقطاع ${arabic}`:`Graphic sector field for ${en}`}>
      <span className="approved-sector-index" aria-hidden="true">{String(index+1).padStart(2,"0")}</span>
      <svg className="approved-sector-lines" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 238 C72 170 94 84 190 108 S306 246 430 108"/><path d="M-10 86 C78 28 164 48 214 118 S302 218 422 182"/></svg>
      <span className="approved-sector-orbit" aria-hidden="true"/><Icon className="approved-sector-mark" aria-hidden="true"/>
    </div>
    <div className="approved-industry-meta"><Icon/><div><h3>{ar?arabic:en}</h3><p>{ar?subAr:sub}</p></div><a href={`/${locale}/work`} aria-label={ar?arabic:en}>↗</a></div>
   </article>)}</div>
 </section>;
}

export function ApprovedFeatureBand({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const [processOpen,setProcessOpen]=useState(false);
 const benefits=[[ShieldCheck,ar?"أقمشة متينة":"Durable Fabrics"],[Sparkles,ar?"راحة في كل تفصيلة":"Comfort in Every Detail"],[Ruler,ar?"تصميم عملي":"Practical Design"],[Layers3,ar?"مصنوع للحياة الواقعية":"Made for Real Life"]] as const;
 return <section id="process" className="approved-feature-band" data-sc-act="pin" data-sc-span="2.25" data-sc-dwell="0.18" data-sc-drift="#0b213e" data-section-id="H03" data-testid="approved-h03">
  <div className="approved-feature-stage" data-sc-stage>
   <article id="about" className="approved-feature-more">
    <div className="approved-fabric-plane" data-sc-parallax="-1.05"><img className="approved-fabric-field" data-component-id="H03A.01" data-media-slot="home.feature.fabric-blue" src="/generated/home-feature-fabric-blue-v1.webp" width={996} height={526} loading="lazy" decoding="async" alt="" aria-hidden="true"/></div>
    <div className="approved-feature-copy" data-sc-cue="0 0.58 0 0.38"><h2 data-component-id="H03A.02" data-sc-kinetic="lines">{ar?"أكثر من\nزي موحّد":"MORE\nTHAN UNIFORMS"}</h2><p data-component-id="H03A.03">{ar?"أقمشة عالية الجودة، تصميم عملي وإنتاج موثوق — زي يعمل بجد مثل من يرتديه.":"Quality fabrics, practical design and reliable production — uniforms that work as hard as the people wearing them."}</p><a data-component-id="H03A.04" className="approved-light-button" href={`/${locale}/garments`}>{ar?"اكتشف مجموعاتنا":"Discover Our Collections"} ↗</a></div>
    <div className="approved-benefit-row" data-component-id="H03A.05" data-sc-cue="0 0.6 0 .35">{benefits.map(([Icon,label])=><div key={label}><Icon/><span>{label}</span></div>)}</div>
   </article>
   <div className="approved-seam-handoff" aria-hidden="true"><span/><i/></div>
   <article className="approved-feature-idea">
    <div className="approved-sketch-plane" data-sc-reveal="left" data-sc-reveal-at="0.22 0.7"><img data-media-slot="home.feature.design-sketch" className="approved-sketch-background approved-sketch-generated" src="/generated/home-feature-design-sketch.svg" width={519} height={263} loading="lazy" decoding="async" alt="" aria-hidden="true"/></div>
    <div className="approved-sketch-mask" aria-hidden="true"/>
    <div className="approved-feature-copy approved-feature-copy-dark" data-sc-cue="0.26 1 0.18 0"><h2 data-component-id="H03B.02" data-sc-kinetic="lines">{ar?"من الفكرة\nإلى الزي":"FROM\nIDEA TO UNIFORM"}</h2><p data-component-id="H03B.03">{ar?"من الفكرة إلى المنتج النهائي — نصمّم ونأخذ العينات ونصنّع الزي الذي يحوّل رؤيتك إلى واقع.":"Concept to final product — designing, sampling and manufacturing uniforms that bring your vision to life."}</p><button data-component-id="H03B.06" className="approved-outline-button" type="button" aria-haspopup="dialog" onClick={()=>setProcessOpen(true)}>{ar?"عمليتنا":"Our Process"} <span aria-hidden="true">↗</span></button></div>
    <div className="approved-process-checklist" data-component-id="H03B.04">{[ar?"تصميم":"Design",ar?"عينة":"Sample",ar?"إنتاج":"Produce",ar?"تسليم":"Deliver"].map((x,i)=><span key={x} data-sc-cue={`${.3+i*.09} ${.72+i*.06} .2 .25`}><Check/> {x}</span>)}</div>
    <div className="approved-hand-note approved-vision-note" data-component-id="H03B.05" data-sc-cue="0.54 1 .22 0">{ar?"رؤيتك.\nخبرتنا.":"Your Vision.\nOur Expertise."}<svg viewBox="0 0 80 38"><path d="M4 7c27 5 43 15 65 24m-12-13 13 13-17 2"/></svg></div>
   </article>
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
