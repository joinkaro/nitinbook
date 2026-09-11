import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product-detail";
import { productBySlug, products } from "@/lib/products";

export function generateStaticParams(){ return products.map(product=>({slug:product.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{ const {slug}=await params; const product=productBySlug(slug); if(!product)return{}; return {title:`${product.name} | Nitin Sports`,description:product.description,openGraph:{title:product.name,description:product.description,type:"website"}}; }
export default async function ProductPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const product=productBySlug(slug); if(!product)notFound(); const jsonLd={"@context":"https://schema.org","@type":"Product",name:product.name,description:product.description,sku:product.sku,brand:{"@type":"Brand",name:product.brand},offers:{"@type":"Offer",priceCurrency:"INR",price:product.price,availability:product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"},aggregateRating:{"@type":"AggregateRating",ratingValue:product.rating,reviewCount:product.stock+18}}; return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><ProductDetail product={product}/></>; }
