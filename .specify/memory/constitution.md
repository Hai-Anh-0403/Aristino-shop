<!--
SYNC IMPACT REPORT
- Version Change: 1.1.0 -> 1.2.0
- Modified Principles: None
- Added Sections:
  * VI. Project Architecture & Naming Conventions (frontend/backend code division and naming rules)
- Removed Sections: None
- Templates Requiring Updates:
  * d:/Work/Shop-web/.specify/templates/plan-template.md (✅ aligned)
  * d:/Work/Shop-web/.specify/templates/spec-template.md (✅ aligned)
  * d:/Work/Shop-web/.specify/templates/tasks-template.md (✅ aligned)
- Follow-up TODOs: None
-->

# Aristino Localization Constitution

## Core Principles

### I. Structural Fidelity
The English website MUST preserve the exact layout, hierarchical structure (Parent -> Child categories), and user flow of the original Vietnamese website. Adding, deleting, or reordering sections or categories is strictly prohibited to keep UI code identical and maintain a consistent layout system.

### II. Premium Translation & Elevated Tone
Translations must avoid literal conversions. Terms MUST be elevated to sound premium, natural, and sophisticated in English, matching a high-end menswear boutique brand image.

### III. UX Navigation Consistency
All header menus, subnav tabs, footer links, and action buttons MUST follow the approved localization mapping to ensure a cohesive user experience across all devices.

### IV. Layout and Aspect Ratio Alignment
Visual assets, banner aspect ratios, and media elements MUST retain their original positions and proportions. Font choices and letter-spacing for English copy must be styled to match the visual footprint of the Vietnamese originals.

### V. SEO Best Practices
Every translated page MUST implement unique page titles, meta descriptions, correct heading hierarchies (one H1 per page), and descriptive alt text for search optimization.

### VI. Project Architecture & Naming Conventions
The repository codebase MUST be strictly separated into a `frontend/` directory (for presentation layer UI) and a `backend/` directory (for API and data logic). On the backend, code MUST be structured into router and controller components. Router files MUST use the naming convention `[name].router.tsx` and controller files MUST use the naming convention `[name].controller.tsx`.

## Additional Constraints

- Codebase division: Strict physical separation of frontend and backend layers.
- Backend modularity: Force componentization into separate `routers/` and `controllers/` directories.
- Naming rules: Enforce file extensions matching `.controller.tsx` and `.router.tsx` formats.
- No alterations to routing structures (e.g. keep category endpoints aligned with the core Haravan platform paths).
- Retain Haravan platform standard integration hooks.
- Support multi-currency or language selector positioning matching the current header.

## Development Workflow

- Step 1: Terminology and mapping validation prior to styling changes.
- Step 2: Implementation of core design rules in template files.
- Step 3: Verification of exact layout alignment on mobile and desktop.
- Step 4: Verification of SEO meta tags.

## Governance
All code submissions and content modifications MUST be validated against this constitution. Any structural variations require explicit client approval and a constitution amendment proposal.

## Master Localization Mapping

### Top Bar & Utility
| Vietnamese Original | English Translation | Context/Placement |
| :--- | :--- | :--- |
| TIẾP NỐI HUYỀN THOẠI | Inherit the Legend | Topbar Announcement Text |
| Tìm cửa hàng | Store Locator | Topbar Link / Footer Link |
| GỌI NGAY | CALL NOW | Topbar CTA |
| Bạn cần tìm gì? | What are you looking for? | Header Search Input Placeholder |
| GỢI Ý | Suggestions | Search Overlay Suggestions Title |
| Black Friday | Black Friday | Suggestion Item |
| Đồ da túi da | Leather Goods & Bags | Suggestion Item |
| Áo | Tops | Suggestion Item |
| Quần | Bottoms | Suggestion Item |
| Phụ Kiện | Accessories | Suggestion Item |
| Hàng mới | New Arrivals | Suggestion Item |

### Sub-Navigation
| Vietnamese Original | English Translation | Context/Placement |
| :--- | :--- | :--- |
| TRANG PHỤC | Apparel | Sub-header Link |
| PHỤ KIỆN | Accessories | Sub-header Link |
| ĐỒ DA | Leather Goods | Sub-header Link |
| THƯƠNG HIỆU | Brands | Sub-header Link |
| ACTIVE | Activewear | Sub-header Link |

### Main Navigation Menu
| Vietnamese Original | English Translation | Hierarchy Level |
| :--- | :--- | :--- |
| Online Exclusive | Online Exclusives | Parent |
| ├─ Elite Polo | ├─ Elite Polos | Child |
| ├─ Áo Sơ Mi Độc Quyền Online | ├─ Online Exclusive Shirts | Child |
| ├─ Ưu đãi 15% | ├─ 15% Off | Child |
| ├─ Ưu đãi 27% | ├─ 27% Off | Child |
| ├─ Ưu đãi 30% | ├─ 30% Off | Child |
| ├─ Ưu đãi 40% | ├─ 40% Off | Child |
| ├─ Ưu đãi 50% | ├─ 50% Off | Child |
| ├─ Ưu đãi 60% | ├─ 60% Off | Child |
| Bộ sưu tập | Collections | Parent |
| ├─ Lookbook July | ├─ July Lookbook | Child |
| ├─ Giao Mùa 2026 | ├─ Pre-Fall 2026 | Child |
| ├─ Elite Polo | ├─ Elite Polos | Child |
| ├─ Da Thực Vật | ├─ Vegan Leather | Child |
| ├─ Luxury Silk Polo | ├─ Luxury Silk Polo | Child |
| ├─ Đan Khí Phách Việt | ├─ Vietnamese Heritage Knits | Child |
| ├─ New Arrivals | ├─ New Arrivals | Child |
| ├─ Đan Lát | ├─ Woven Heritage | Child |
| ├─ Hồn Dân Tộc - Dấu Di Sản | ├─ National Soul & Heritage | Child |
| ├─ Huyền Thoại Phương Đông | ├─ Eastern Legends | Child |
| ├─ Đồ Da Hùng Vương | ├─ Hung Vuong Leather Collection | Child |
| Hàng mới | New Arrivals | Parent |
| Áo | Tops | Parent |
| ├─ Áo Sơ Mi | ├─ Shirts | Child (Sub-Parent) |
| │  ├─ Sơ mi Regular Fit | │  ├─ Regular Fit Shirts | Grandchild |
| │  ├─ Sơ mi Slim Fit | │  ├─ Slim Fit Shirts | Grandchild |
| │  ├─ Sơ mi Perfect Fit | │  ├─ Perfect Fit Shirts | Grandchild |
| │  ├─ Áo Sơ mi ngắn tay | │  ├─ Short-Sleeve Shirts | Grandchild |
| │  ├─ Áo Sơ mi dài tay | │  ├─ Long-Sleeve Shirts | Grandchild |
| │  └─ Sơ mi Trắng | │  └─ Classic White Shirts | Grandchild |
| ├─ Áo Polo | ├─ Polo Shirts | Child (Sub-Parent) |
| │  ├─ Elite Polo | │  ├─ Elite Polos | Grandchild |
| │  ├─ Áo Polo ngắn tay | │  ├─ Short-Sleeve Polos | Grandchild |
| │  ├─ Áo Polo dài tay | │  ├─ Long-Sleeve Polos | Grandchild |
| │  ├─ Polo Regular Fit | │  ├─ Regular Fit Polos | Grandchild |
| │  ├─ Polo Slim Fit | │  ├─ Slim Fit Polos | Grandchild |
| │  └─ Polo Tech Gofl/ Golf Fit | │  └─ Tech Golf / Golf Fit Polos | Grandchild |
| ├─ Áo Thun | ├─ T-Shirts | Child (Sub-Parent) |
| │  ├─ Áo Thun ngắn tay | │  ├─ Short-Sleeve T-Shirts | Grandchild |
| │  └─ Áo Thun dài tay | │  └─ Long-Sleeve T-Shirts | Grandchild |
| ├─ Áo Khoác | ├─ Jackets & Outerwear | Child |
| ├─ Áo Tanktop | ├─ Tank Tops | Child |
| └─ Áo Dài | └─ Ao Dai | Child |
| Quần | Bottoms | Parent |
| ├─ Quần Âu | ├─ Trousers | Child |
| ├─ Quần Regular Fit | ├─ Regular Fit Pants | Child |
| ├─ Quần Kaki | ├─ Chinos | Child |
| ├─ Quần Slim Fit | ├─ Slim Fit Pants | Child |
| ├─ Quần Jeans | ├─ Jeans | Child |
| ├─ Quần Cropped | ├─ Cropped Trousers | Child |
| ├─ Quần Short | ├─ Shorts | Child |
| ├─ Quần Fiero | ├─ Fiero Pants | Child |
| └─ Quần Thể Thao | └─ Sweatpants & Joggers | Child |
| Suits & Blazer | Suits & Blazers | Parent |
| ├─ Blazer | ├─ Blazers | Child |
| └─ Bộ Suits | └─ Suits | Child |
| Đồ Mặc Trong | Underwear & Loungewear | Parent |
| ├─ Quần Boxer | ├─ Boxers | Child |
| ├─ Quần Brief | ├─ Briefs | Child |
| ├─ Áo lót | ├─ Undershirts | Child |
| └─ Đồ giữ nhiệt | └─ Thermal Wear | Child |
| Phụ Kiện | Accessories | Parent |
| ├─ Nước Hoa | ├─ Fragrances | Child |
| ├─ Túi Da | ├─ Leather Bags | Child |
| ├─ Ví Da | ├─ Leather Wallets | Child |
| ├─ Cặp da | ├─ Leather Briefcases | Child |
| ├─ Cà Vạt | ├─ Ties & Neckwear | Child |
| ├─ Giày & Dép | ├─ Footwear | Child |
| ├─ Thắt Lưng Da | ├─ Leather Belts | Child |
| ├─ Bít Tất | ├─ Socks | Child |
| ├─ Khăn quàng cổ | ├─ Scarves | Child |
| ├─ Măng sét | ├─ Cufflinks | Child |
| ├─ Mũ Nam | ├─ Hats & Headwear | Child |
| ├─ Găng Tay | ├─ Gloves | Child |
| └─ Móc khóa | └─ Keyrings & Keychains | Child |

### Footer Columns
| Vietnamese Original | English Translation | Context/Placement |
| :--- | :--- | :--- |
| CÔNG TY CỔ PHẦN ĐẦU TƯ K&G VIỆT NAM | K&G VIETNAM INVESTMENT JOINT STOCK COMPANY | Footer Intro Header |
| Trụ sở chính: Tầng 11, Khối A, Tòa nhà Sông Đà, Đường Phạm Hùng, Phường Từ Liêm, TP Hà Nội | Headquarters: 11th Floor, Block A, Song Da Building, Pham Hung Road, Tu Liem District, Hanoi City, Vietnam | Footer Intro Content |
| Chi Nhánh: 84 Nguyễn Trãi, Phường Chợ Quán, Hồ Chí Minh, Việt Nam. | Branch: 84 Nguyen Trai Street, Cho Quan Ward, District 5, Ho Chi Minh City, Vietnam | Footer Intro Content |
| Mã số thuế: 0105911105 | Tax Code: 0105911105 | Footer Intro Content |
| Đăng ký nhận tin điện tử | Subscribe to Our Newsletter | Footer Newsletter Header |
| Hãy nhập email của bạn để nhận những tin tức mới nhất của chúng tôi | Enter your email address to receive our latest updates and exclusive offers. | Footer Newsletter Content |
| GỬI | SUBMIT | Footer Newsletter Button |
| Theo dõi chúng tôi | Follow Us | Footer Social Header |
| Hotline: 18006226 | Hotline: 1800 6226 | Footer Content |
| Về chúng tôi | About Us | Footer Link Column 1 Header |
| ├─ Giới thiệu Aristino | ├─ About Aristino | Link |
| ├─ Cửa hàng gần bạn | ├─ Store Locator | Link |
| ├─ Ngôi Nhà Chung K&G | ├─ K&G Corporate Portal | Link |
| ├─ Tuyển dụng | ├─ Careers | Link |
| ├─ Wear-Care-Share | ├─ Wear-Care-Share | Link |
| ├─ Tin tức | ├─ News & Editorial | Link |
| └─ Nhà máy sản xuất | └─ Our Manufacturing Plants | Link |
| Chính sách & Điều khoản | Policies & Terms | Footer Link Column 2 Header |
| ├─ Chính sách hội viên | ├─ Membership Program Policy | Link |
| ├─ Chính sách giao hàng | ├─ Shipping & Delivery Policy | Link |
| ├─ Chính sách đổi hàng | ├─ Return & Exchange Policy | Link |
| ├─ Chính sách bảo hành | ├─ Warranty Policy | Link |
| ├─ Chính sách bảo mật | ├─ Privacy Policy | Link |
| ├─ Điều khoản dịch vụ | ├─ Terms of Service | Link |
| └─ Hướng dẫn mua hàng | └─ How to Shop | Link |
| Manufacture | Manufacture / Production | Footer Link Column 3 Header |
| ├─ Amazon | ├─ Amazon Store | Link |
| └─ OEM/ODM | └─ OEM/ODM Services | Link |
| Dịch vụ khách hàng | Customer Service | Footer Link Column 4 Header |
| ├─ Trạng thái đơn hàng | ├─ Track Your Order | Link |
| └─ Câu hỏi thường gặp | └─ FAQs | Link |
| Thanh toán | Payment | Footer Link Column 5 Header |
| Bản quyền © 2024 KGVIETNAM | Copyright © 2024 KGVIETNAM. All rights reserved. | Copyright Line |

## Brand Copywriting Blueprint

This section defines the core styling and copy constraints for key text nodes on the brand-new English homepage, aligning the brand voice with elite luxury menswear retailers (e.g., Massimo Dutti, Suitsupply).

### 1. Hero Section
- **Headline**: *ITALIAN REFINEMENT. TAILORED FOR THE MODERN GENTLEMAN.*
- **Subheadline**: *A curation of clean silhouettes, lightweight Italian-inspired structures, and premium fabrics. Engineered for the man who navigates life with quiet confidence.*
- **Call-to-Action (CTA)**: *EXPLORE THE COLLECTION*

### 2. Category Spotlight
- **The Art of Shirting** (Áo Sơ Mi):
  * *From crisp double-ply Egyptian cottons to relaxed Italian linen blends, our shirts are engineered with absolute precision. Perfectly structured collars, hand-finished cuffs, and a tailored silhouette that transitions seamlessly from executive meetings to sunset dinners.*
- **The Signature Polo** (Áo Polo):
  * *The ultimate expression of smart-casual refinement. Knitted from ultra-fine Mercerized cotton and premium silk blends, our signature polos deliver unparalleled softness and a sharp, contoured drape.*
- **Tailored Trousers** (Quần):
  * *A study in form and function. Crafted from lightweight cotton-linen twills and fine wools, featuring clean lines, perfect hang, and meticulous waistband construction for comfort that never compromises style.*
- **Suits & Blazers** (Suits & Blazer):
  * *Structured shoulders, high armholes, and lightweight canvas construction. Designed to command attention with effortless sophistication.*

### 3. Brand Value Proposition
- **Premium Materials**:
  * *We source only the world's most luxurious fabrics—from long-staple cotton and extra-fine Merino wool to pure Mulberry silk. Every thread is selected for its breathability, drape, and enduring texture.*
- **Italian Craftsmanship**:
  * *Inspired by classical Italian tailoring traditions, our designs blend timeless European aesthetics with meticulous attention to detail. Every seam is a testament to rigorous craftsmanship.*
- **Perfect Tailored Fit**:
  * *A silhouette sculpted to highlight masculine strength. Our signature cuts are refined to drape naturally over the body, offering modern comfort with a sharp, bespoke feel.*

### 4. Seasonal Campaign/Collection
- **Campaign Title**: *PRE-FALL 2026: THE LEGEND CONTINUES*
- **Campaign Introduction**:
  * *An ode to classic tailoring set against a modern horizon. Our Pre-Fall 2026 collection balances structured silhouettes with lightweight layers, crafted to navigate shifting seasons with ease. Rich earthy tones, luxurious textured knits, and functional details combine to redefine modern smart-casual dressing.*
- **Call-to-Action (CTA)**: *DISCOVER THE CAMPAIGN*

### 5. Footer Newsletter & Trust Badges
- **Newsletter Title**: *THE ARISTINO REGISTRY*
- **Newsletter Subtitle**: *Subscribe to receive early access to new collections, private invitations, and seasonal styling editorials. Elevate your wardrobe, one curatorial guide at a time.*
- **Authenticity Guarantee**: *100% Authentic Craftsmanship*
- **Shipping Policy**: *Complimentary Delivery on orders over 500k VND*
- **Warranty Policy**: *180-Day Signature Guarantee*
- **Return & Exchange Policy**: *Bespoke 15-day Returns*

**Version**: 1.2.0 | **Ratified**: 2026-07-15 | **Last Amended**: 2026-07-15
