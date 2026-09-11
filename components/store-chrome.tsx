"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useShop } from "@/components/shop-provider";

export const WHATSAPP_BASE = "https://wa.me/15553409018?text=HEY%20I%20NEED%20ORDER";
export const whatsappLink = (message?:string) => { void message; return WHATSAPP_BASE; };

const links = [
  ["Home","/"],["Cricket","/#cricket"],["Football","/#football"],
  ["Teamwear","/#teamwear"],["Accessories","/#accessories"],["Contact","/#contact"]
];

export function StoreHeader() {
  const {cartCount} = useShop();
  return <>
    <div className="promo">FREE PAN-INDIA DELIVERY ON ORDERS OVER ₹2,999</div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Nitin Sports home"><span className="brand-mark">N</span><span>NITIN<span>SPORTS</span></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label,href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="icon-button desktop-only" aria-label="Search products" href="/search"><Search size={19}/></Link>
        <Link className="icon-button" aria-label={`Open cart with ${cartCount} items`} href="/cart"><ShoppingBag size={19}/><span className="cart-count">{cartCount}</span></Link>
        <a className="whatsapp-button desktop-only" href={WHATSAPP_BASE} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16}/></a>
        <Sheet>
          <SheetTrigger asChild><button className="icon-button mobile-only" aria-label="Open menu"><Menu size={21}/></button></SheetTrigger>
          <SheetContent className="mobile-sheet" side="right">
            <SheetHeader><SheetTitle className="sheet-brand">NITIN<span>SPORTS</span></SheetTitle></SheetHeader>
            <nav className="mobile-nav">{links.map(([label,href]) => <SheetClose asChild key={label}><Link href={href}>{label}<ArrowUpRight size={18}/></Link></SheetClose>)}</nav>
            <SheetClose asChild><Link className="sheet-search" href="/search"><Search size={18}/> Search products</Link></SheetClose>
            <a className="primary-cta sheet-cta" href={WHATSAPP_BASE} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Order on WhatsApp</a>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  </>;
}

export function StoreFooter() {
  return <footer className="footer" id="contact">
    <div className="footer-top">
      <div><Link className="brand footer-brand" href="/"><span className="brand-mark">N</span><span>NITIN<span>SPORTS</span></span></Link><p>Original sports equipment and custom teamwear for players, clubs and academies across India.</p></div>
      <div><h3>Shop</h3><Link href="/#cricket">Cricket</Link><Link href="/#football">Football</Link><Link href="/#teamwear">Teamwear</Link><Link href="/#accessories">Accessories</Link></div>
      <div><h3>Help</h3><Link href="/policies/shipping">Shipping policy</Link><Link href="/policies/returns">Return policy</Link><Link href="/policies/privacy">Privacy policy</Link><Link href="/policies/terms">Terms & conditions</Link></div>
      <div><h3>Need a hand?</h3><p>Get product, sizing and team-order guidance directly on WhatsApp.</p><a className="primary-cta footer-cta" href={WHATSAPP_BASE} target="_blank" rel="noreferrer">Chat with us <ArrowUpRight size={17}/></a></div>
    </div>
    <div className="footer-bottom"><span>© 2026 Nitin Sports</span><span>Made for the game.</span></div>
  </footer>;
}

export function FloatingWhatsApp() {
  return <a className="floating-whatsapp" href={WHATSAPP_BASE} target="_blank" rel="noreferrer" aria-label="Order on WhatsApp"><MessageCircle size={20}/><span>Order on WhatsApp</span></a>;
}
