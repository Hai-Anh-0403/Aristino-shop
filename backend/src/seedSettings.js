require('dotenv').config();
const connectDB = require('./config/db');
const Setting = require('./models/Setting');

const DEFAULT_SETTINGS = [
  {
    key: 'lookbook_info',
    value: {
      title: 'INHERIT THE LEGEND',
      description: 'In the era of a rising Vietnam, every man defines his own path with the courage to move forward. Guided by this spirit, Aristino presents the story of "Vietnamese character from unique courage" – where inner strength is not defined by blending in, but by persistent personal identity. Each persona is a distinct thread, weaving a modern Vietnam: self-reliant, resilient, adaptive, and constantly striving to continue the legacy of "Inheriting the Legend".',
    },
  },
  {
    key: 'homepage_video',
    value: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'mp4',
      embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  },
  {
    key: 'homepage_banners',
    value: [
      {
        src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
        alt: 'New Arrivals',
        label: 'NEW ARRIVALS',
        href: '/collections/new-arrivals',
      },
      {
        src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop',
        alt: 'New Collection',
        label: 'NEW COLLECTION',
        href: '/collections/new-collection',
      },
      {
        src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1200&auto=format&fit=crop',
        alt: 'Luxury Suits',
        label: 'LUXURY SUITS',
        href: '/collections/suits-blazers',
      },
      {
        src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=1200&auto=format&fit=crop',
        alt: 'Activewear',
        label: 'ACTIVEWEAR',
        href: '/collections/activewear',
      },
    ],
  },
  {
    key: 'kol_slider_products',
    value: [],
  },
];

const seedSettings = async () => {
  try {
    await connectDB();
    console.log('📦 Seeding Default Settings...');

    for (const setting of DEFAULT_SETTINGS) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { key: setting.key, value: setting.value },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Seeded Settings successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding settings:', error.message);
    process.exit(1);
  }
};

seedSettings();
