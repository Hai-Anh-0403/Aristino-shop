"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { HeroSlideshow } from '../../components/HeroSlideshow';
import { SubBrandCarousel } from '../../components/SubBrandCarousel';
import { FlashSale } from '../../components/FlashSale';

// Lazy-load below-the-fold components to reduce TBT
const VideoShowcase = dynamic(
  () => import('../../components/VideoShowcase').then(mod => ({ default: mod.VideoShowcase })),
  { ssr: false }
);
const EditorialCarousel = dynamic(
  () => import('../../components/EditorialCarousel').then(mod => ({ default: mod.EditorialCarousel })),
  { ssr: false }
);
const EditorialSection = dynamic(
  () => import('../../components/EditorialSection').then(mod => ({ default: mod.EditorialSection })),
  { ssr: false }
);
const CollectionBanners = dynamic(
  () => import('../../components/CollectionBanners').then(mod => ({ default: mod.CollectionBanners })),
  { ssr: false }
);
const NewCollection = dynamic(
  () => import('../../components/NewCollection').then(mod => ({ default: mod.NewCollection })),
  { ssr: false }
);
const AristinoKOL = dynamic(
  () => import('../../components/AristinoKOL').then(mod => ({ default: mod.AristinoKOL })),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-brand-offwhite relative">
      <HeroSlideshow />
      <SubBrandCarousel />
      <FlashSale />
      <VideoShowcase />
      <EditorialCarousel />
      <EditorialSection />
      <CollectionBanners />
      <NewCollection />
      <AristinoKOL />
    </main>
  );
}
