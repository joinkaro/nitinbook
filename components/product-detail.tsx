"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/storefront";
import { StoreFooter, StoreHeader, whatsappLink } from "@/components/store-chrome";
import { useShop } from "@/components/shop-provider";

export default function ProductDetail({product}:{product:Product}) {
  const [size,setSize]=useState(product.sizes[0]); const [quantity,setQuantity]=useState(1); const [view,setView]=useState(0); const {addToCart}=useShop();
  const msg=`HEY I NEED ORDER\n\nProduct: ${product.name}\nSize: ${size}\nQuantity: ${quantity}\nPrice: ${formatPrice(product.price*quantity)}`;
  const add=()=>{addToCart(product.slug,size,quantity);toast.success(`${product.name} added to cart`)};
  return <main className="detail-page"><StoreHeader/><div className="breadcrumbs"><Link href="/"><ChevronLeft size={15}/> Continue shopping</Link><span>{product.sport} / {product.type}</span></div><section className="product-detail"><div className="gallery"><div className={`gallery-main gallery-view-${view}`}><ProductImage product={product}/><span>{view===0?"FRONT VIEW":view===1?"MATERIAL DETAIL":"MATCH SCALE"}</span></div><div className="gallery-thumbs">{[0,1,2].map(i=><button key={i} className={view===i?"active":""} onClick={()=>setView(i)} aria-label={`View product image ${i+1}`}><ProductImage product={product}/></button>)}</div></div><div className="detail-copy"><p className="detail-kicker">{product.sport} / {product.type}</p><h1>{product.name}</h1><div className="detail-rating"><Star size={16} fill="currentColor"/> {product.rating} <span>Verified player rating</span></div><div className="detail-price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice&&<><del>{formatPrice(product.oldPrice)}</del><span>Save {formatPrice(product.oldPrice-product.price)}</span></>}</div><p className="detail-description">{product.description}</p><div className="stock"><span/> In stock · ready to dispatch</div><fieldset className="size-picker"><legend>Choose size / variant</legend>{product.sizes.map(value=><button key={value} className={size===value?"active":""} onClick={()=>setSize(value)}>{value}</button>)}</fieldset><div className="purchase-row"><div className="quantity"><button onClick={()=>setQuantity(Math.max(1,quantity-1))} aria-label="Decrease quantity"><Minus size={16}/></button><span>{quantity}</span><button onClick={()=>setQuantity(quantity+1)} aria-label="Increase quantity"><Plus size={16}/></button></div><button className="detail-add" onClick={add}>Add to cart</button></div><Link className="detail-buy" href={`/checkout?product=${product.slug}&size=${encodeURIComponent(size)}&quantity=${quantity}`}>Buy now</Link><a className="detail-whatsapp" href={whatsappLink(msg)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Order on WhatsApp</a><div className="detail-benefits"><span><Truck/>Pan-India delivery</span><span><ShieldCheck/>Secure ordering</span><span><Check/>Quality checked</span></div><div className="specs"><h2>Specifications</h2>{product.specifications.map((spec,i)=><div key={spec}><span>{String(i+1).padStart(2,"0")}</span>{spec}</div>)}<div><span>SKU</span>{product.sku}</div></div></div></section><StoreFooter/></main>;
}
