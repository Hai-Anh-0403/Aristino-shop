"use client";

import React from 'react';
import { HeroSlideshow } from '../../components/HeroSlideshow';
import { SubBrandCarousel } from '../../components/SubBrandCarousel';
import { FlashSale } from '../../components/FlashSale';
import { VideoShowcase } from '../../components/VideoShowcase';
import { EditorialCarousel } from '../../components/EditorialCarousel';
import { EditorialSection } from '../../components/EditorialSection';
import { CollectionBanners } from '../../components/CollectionBanners';
import { NewCollection } from '../../components/NewCollection';
import { AristinoKOL } from '../../components/AristinoKOL';

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
