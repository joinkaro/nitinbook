"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MessageCircle, ShieldCheck, SlidersHorizontal, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice, products, Product, spritePosition } from "@/lib/products";
import { useShop } from "@/components/shop-provider";
import { StoreFooter, StoreHeader, WHATSAPP_BASE, whatsappLink } from "@/components/store-chrome";

const categories = [
  {name:"Cricket",desc:"Bats, balls and match essentials",index:0,href:"#cricket"},
  {name:"Football",desc:"Match balls, boots and kits",index:8,href:"#football"},
  {name:"Teamwear",desc:"Custom kits for every squad",index:10,href:"#teamwear"},
  {name:"Training equipment",desc:"Sharper sessions, faster feet",index:14,href:"#football"},
  {name:"Protective gear",desc:"Confidence for every contest",index:4,href:"#cricket"},
  {name:"Sports accessories",desc:"The details that complete your kit",index:15,href:"#accessories"},
];

export function ProductImage({product,className=""}:{product:Product;className?:string}) {
  return <div className={`sprite-image ${className}`} role="img" aria-label={product.name} style={{backgroundPosition:spritePosition(product.imageIndex)}}/>;
}

export function ProductCard({product}:{product:Product}) {
  const {addToCart} = useShop();
  const [size,setSize] = useState(product.sizes[0]);
  const discount = product.oldPrice ? Math.round((1-product.price/product.oldPrice)*100) : 0;
  const add = () => { addToCart(product.slug,size); toast.success(`${product.name} added to cart`); };
  const msg = `HEY I NEED ORDER\n\nProduct: ${product.name}\nSize: ${size}\nQuantity: 1\nPrice: ${formatPrice(product.price)}`;
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-visual" aria-label={`View ${product.name}`}><ProductImage product={product}/>{discount>0&&<span className="sale-badge">-{discount}%</span>}<span className="view-product">View gear <ArrowUpRight size={15}/></span></Link>
    <div className="product-info">
      <div className="rating"><Star size={13} fill="currentColor"/> {product.rating} <span>({product.stock + 18})</span></div>
      <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
      <div className="price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice&&<del>{formatPrice(product.oldPrice)}</del>}</div>
      <label className="variant-label">Choose size<select value={size} onChange={(e)=>setSize(e.target.value)} aria-label={`Choose size for ${product.name}`}>{product.sizes.map(value=><option key={value}>{value}</option>)}</select></label>
      <div className="card-actions"><button onClick={add}>Add to cart</button><Link href={`/checkout?product=${product.slug}&size=${encodeURIComponent(size)}`}>Buy now</Link></div>
      <a className="card-whatsapp" href={whatsappLink(msg)} target="_blank" rel="noreferrer"><MessageCircle size={15}/> WhatsApp order</a>
    </div>
  </article>;
}

function FilterPanel({sport,setSport,price,setPrice,rating,setRating}:{sport:string;setSport:(x:string)=>void;price:number;setPrice:(x:number)=>void;rating:number;setRating:(x:number)=>void}) {
  return <div className="filter-panel">
    <div><span>Sport</span>{["All","Cricket","Football"].map(v=><button className={sport===v?"active":""} key={v} onClick={()=>setSport(v)}>{v}</button>)}</div>
    <div><span>Price</span>{[["All",10000],["Under ₹1,000",1000],["Under ₹2,500",2500],["Under ₹5,000",5000]].map(([label,value])=><button className={price===value?"active":""} key={label} onClick={()=>setPrice(Number(value))}>{label}</button>)}</div>
    <div><span>Rating</span>{[0,4.7,4.8].map(v=><button className={rating===v?"active":""} key={v} onClick={()=>setRating(v)}>{v===0?"All ratings":`${v}+ stars`}</button>)}</div>
  </div>;
}

export default function Storefront() {
  const [sport,setSport]=useState("All"); const [price,setPrice]=useState(10000); const [rating,setRating]=useState(0);
  const filtered = useMemo(()=>products.filter(p=>(sport==="All"||p.sport===sport)&&p.price<=price&&p.rating>=rating),[sport,price,rating]);
  return <main>
    <StoreHeader/>
    <section className="mobile-offer-banner" aria-label="Nitin Sports first order offer">
      <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer" aria-label="Order on WhatsApp with the Nitin Sports first-order offer">
        <Image src="/nitin-mobile-offer-banner.png" alt="Nitin Sports 10 percent first-order offer with safe ordering, customer support and Pan-India service" width={1254} height={1254} sizes="(max-width: 980px) 100vw, 1px" />
      </a>
    </section>
    <section className="hero" id="top">
      <Image className="hero-image" src="/hero-sports-studio.png" alt="Cricket bat, helmet, ball, football and training equipment in a dark premium studio" fill priority sizes="100vw" />
      <div className="hero-shade"/><div className="hero-copy"><p className="eyebrow"><span/>CRICKET · FOOTBALL · TEAMWEAR</p><h1>Gear up.<br/><em>Play beyond.</em></h1><p className="hero-description">Match-ready equipment, protection and team kits—selected for athletes who expect more from every session.</p><div className="hero-actions"><a className="primary-cta" href="#shop">Shop now <ArrowUpRight size={18}/></a><a className="secondary-cta" href={WHATSAPP_BASE} target="_blank" rel="noreferrer">Order on WhatsApp</a></div></div>
      <div className="hero-proof"><strong>4.9</strong><span>★★★★★<br/><small>PLAYER RATED</small></span></div>
    </section>
    <section className="trust-strip" aria-label="Store benefits">
      <div><ShieldCheck/><p><strong>Premium quality</strong>Match-grade gear</p></div><div><Truck/><p><strong>Fast delivery</strong>Across India</p></div><div><Check/><p><strong>Secure ordering</strong>Clear checkout</p></div><div><MessageCircle/><p><strong>WhatsApp support</strong>Real guidance</p></div>
    </section>

    <section className="light-section category-section"><div className="section-heading"><div><p className="kicker">SHOP YOUR SPORT</p><h2>Built around your game.</h2></div><p>Move from first practice to match day with gear chosen for performance, comfort and repeat use.</p></div><div className="category-grid">{categories.map((c)=><a key={c.name} href={c.href} className="category-card"><div className="sprite-image" style={{backgroundPosition:spritePosition(c.index)}} role="img" aria-label={c.name}/><div><span>{c.name}</span><p>{c.desc}</p><b>Shop now <ArrowRight size={15}/></b></div></a>)}</div></section>

    <section className="light-section shop-section" id="shop"><div className="section-heading"><div><p className="kicker">THE EQUIPMENT ROOM</p><h2>Find your next edge.</h2></div><Sheet><SheetTrigger asChild><button className="filter-trigger"><SlidersHorizontal size={17}/> Filters</button></SheetTrigger><SheetContent side="bottom" className="filter-sheet"><SheetHeader><SheetTitle>Filter equipment</SheetTitle></SheetHeader><FilterPanel sport={sport} setSport={setSport} price={price} setPrice={setPrice} rating={rating} setRating={setRating}/></SheetContent></Sheet></div><div className="shop-layout"><aside className="desktop-filters"><FilterPanel sport={sport} setSport={setSport} price={price} setPrice={setPrice} rating={rating} setRating={setRating}/></aside><div><div className="results-bar"><span>{filtered.length} products</span><Link href="/search">Search full catalogue <ChevronRight size={15}/></Link></div><div className="product-grid">{filtered.map(p=><ProductCard product={p} key={p.slug}/>)}</div></div></div></section>

    <section className="dark-collection" id="cricket"><div className="collection-heading"><p className="kicker">01 / CRICKET</p><h2>Own the crease.</h2><p>Willow, protection and apparel for players who take every ball personally.</p></div><div className="product-grid">{products.filter(p=>p.sport==="Cricket").map(p=><ProductCard product={p} key={p.slug}/>)}</div></section>

    <section className="teamwear" id="teamwear"><div className="teamwear-copy"><p className="kicker">CUSTOM TEAMWEAR</p><h2>One team.<br/>One identity.</h2><p>Custom cricket jerseys, football kits, academy uniforms and complete club sets. Choose colours, add names and numbers, and order for your full squad.</p><ul><li>Design support included</li><li>Kids to adult sizing</li><li>Academy quantities welcome</li></ul><a className="primary-cta" href={whatsappLink("HEY I NEED ORDER\n\nI’m interested in a custom team kit. Please help with design, sizes and pricing.")} target="_blank" rel="noreferrer">Get custom team kit <ArrowUpRight size={18}/></a></div><div className="teamwear-visual"><div className="sprite-image" style={{backgroundPosition:spritePosition(10)}}/><div className="kit-number">11</div><span>CUSTOM / CLUB / ACADEMY</span></div></section>

    <section className="light-section football-section" id="football"><div className="section-heading"><div><p className="kicker">02 / FOOTBALL</p><h2>Control every moment.</h2></div><p>Reliable match equipment and training tools for players, coaches, schools and clubs.</p></div><div className="product-grid">{products.filter(p=>p.sport==="Football").map(p=><ProductCard product={p} key={p.slug}/>)}</div></section>

    <section className="accessory-banner" id="accessories"><div><p className="kicker">COMPLETE YOUR KIT</p><h2>Small details.<br/>Big difference.</h2></div><Link className="primary-cta" href="/search?q=accessories">Shop accessories <ArrowUpRight size={18}/></Link></section>
    <StoreFooter/>
  </main>;
}
