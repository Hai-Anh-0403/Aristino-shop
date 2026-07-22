const Setting = require('../models/Setting');

/**
 * Helper to analyze and extract embed URLs for YouTube and TikTok links.
 */
const parseVideoUrl = (url) => {
  if (!url) return { type: 'mp4', embedUrl: '' };

  const trimmed = url.trim();

  // 1. YouTube Matchers
  // Standard: https://www.youtube.com/watch?v=VIDEO_ID
  // Short: https://youtu.be/VIDEO_ID
  // Embed: https://www.youtube.com/embed/VIDEO_ID
  // Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // 2. TikTok Matchers
  // Standard: https://www.tiktok.com/@username/video/VIDEO_ID
  // Mobile short link: https://vt.tiktok.com/VIDEO_ID (will be redirected on browser, but we parse standard format here)
  const ttRegex = /tiktok\.com\/@[^\/]+\/video\/(\d+)/i;
  const ttMatch = trimmed.match(ttRegex);
  if (ttMatch && ttMatch[1]) {
    return {
      type: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`,
    };
  }

  // 3. Fallback/Direct video file (MP4, WebM, etc.)
  return {
    type: 'mp4',
    embedUrl: trimmed,
  };
};

/**
 * Helper to provide fallback default settings if not yet set in database
 */
const getDefaultSetting = (key) => {
  switch (key) {
    case 'lookbook_info':
      return {
        title: 'INHERIT THE LEGEND',
        description: 'In the era of a rising Vietnam, every man defines his own path with the courage to move forward. Guided by this spirit, Aristino presents the story of "Vietnamese character from unique courage" – where inner strength is not defined by blending in, but by persistent personal identity. Each persona is a distinct thread, weaving a modern Vietnam: self-reliant, resilient, adaptive, and constantly striving to continue the legacy of "Inheriting the Legend".',
      };
    case 'homepage_video':
      return {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'mp4',
        embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      };
    case 'homepage_banners':
      return [
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
      ];
    case 'kol_slider_products':
      return [];
    case 'flash_sale_end_time':
      // Default: 24 hours from now
      return { endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };

    default:
      return null;
  }
};

/**
 * @desc    Get setting by key
 * @route   GET /api/settings/:key
 */
const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });

    if (!setting) {
      const fallbackValue = getDefaultSetting(req.params.key);
      return res.status(200).json({
        success: true,
        data: fallbackValue,
      });
    }

    res.json({
      success: true,
      data: setting.value,
    });
  } catch (error) {
    console.error('getSetting error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching setting',
    });
  }
};


/**
 * @desc    Create or update setting by key
 * @route   POST /api/settings/:key
 */
const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    let { value } = req.body;

    // Special logic if updating homepage_video: parse url
    if (key === 'homepage_video' && typeof value === 'object' && value.url) {
      const parsed = parseVideoUrl(value.url);
      value = {
        url: value.url,
        type: parsed.type,
        embedUrl: parsed.embedUrl,
      };
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: setting.value,
      message: `Setting '${key}' updated successfully`,
    });
  } catch (error) {
    console.error('updateSetting error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating setting',
    });
  }
};

module.exports = {
  getSetting,
  updateSetting,
};
