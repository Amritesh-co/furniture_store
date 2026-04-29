# Graph Report - .  (2026-04-18)

## Corpus Check
- 116 files · ~59,309 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 244 nodes · 329 edges · 56 communities detected
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 40 edges
2. `GET()` - 35 edges
3. `PUT()` - 18 edges
4. `formatPrice()` - 17 edges
5. `connectDB()` - 12 edges
6. `handleInvoiceRequest()` - 10 edges
7. `DELETE()` - 9 edges
8. `errorResponse()` - 9 edges
9. `buildOrderQuery()` - 8 edges
10. `getBusinessInfo()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `CheckoutPage()` --calls--> `useCart()`  [INFERRED]
  app/checkout/page.js → context/CartContext.js
- `CartPage()` --calls--> `useCart()`  [INFERRED]
  app/cart/page.js → context/CartContext.js
- `AddToCartSection()` --calls--> `useCart()`  [INFERRED]
  components/AddToCartSection.jsx → context/CartContext.js
- `Navbar()` --calls--> `useCart()`  [INFERRED]
  components/Navbar.jsx → context/CartContext.js
- `ContactPage()` --calls--> `useBusinessSettings()`  [INFERRED]
  app/contact/page.js → lib/useBusinessSettings.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.0
Nodes (14): validateObjectId(), errorResponse(), handleApiError(), successResponse(), buildOrderQuery(), DELETE(), GET(), handleInvoiceRequest() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.0
Nodes (9): isValidEmail(), isValidPassword(), sanitizeString(), validateInventoryUpdatePayload(), validateOrderPayload(), validateProductPayload(), checkAuth(), POST() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.0
Nodes (7): AdminAnalyticsPage(), AdminOrderDetailPage(), AdminOverviewPage(), CartPage(), CheckoutPage(), formatPrice(), OrderSuccessPage()

### Community 3 - "Community 3"
Cohesion: 0.0
Nodes (14): applyInventoryUpdate(), autoGenerateAndSendInvoiceForOrder(), buildCustomerDetails(), buildInvoiceId(), buildPdfPayload(), buildProductsWithWarranty(), ensureInvoiceForOrder(), sendOrderInvoiceEmail() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.0
Nodes (16): DEPLOYMENT Guide, README, File Icon, Globe Icon, Next.js Wordmark Logo, Rotaract Club of R.V.C.E. Logo Image, Vercel Triangle Logo, Window Icon (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.0
Nodes (6): Footer(), ContactPage(), CustomFurniturePage(), LoginForm(), useBusinessSettings(), WhatsAppButton()

### Community 6 - "Community 6"
Cohesion: 0.0
Nodes (8): mergeBusinessInfo(), getTransporter(), sendContactEmail(), sendCustomInquiryEmail(), sendInvoiceEmail(), AboutPage(), getBusinessInfo(), updateBusinessInfo()

### Community 7 - "Community 7"
Cohesion: 0.0
Nodes (6): AddToCartSection(), useCart(), CartItem(), Navbar(), formatPrice(), ProductCard()

### Community 8 - "Community 8"
Cohesion: 0.0
Nodes (8): connectDB(), generateMetadata(), getFeaturedProducts(), getProduct(), getRelated(), HomePage(), ProductPage(), seed()

### Community 9 - "Community 9"
Cohesion: 0.0
Nodes (7): getClientIp(), getRatelimiter(), getRedisClient(), memoryRateLimit(), rateLimit(), warnFallbackOnce(), warnRedisFailureOnce()

### Community 10 - "Community 10"
Cohesion: 0.0
Nodes (4): generateCustomerInformation(), generateHr(), generateInvoiceTable(), generateTableRow()

### Community 11 - "Community 11"
Cohesion: 0.0
Nodes (4): getCloudinary(), getOptimizedCloudinaryUrl(), normalizeEnv(), requireEnv()

### Community 12 - "Community 12"
Cohesion: 0.0
Nodes (1): ShopContent()

### Community 13 - "Community 13"
Cohesion: 0.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 0.0
Nodes (2): getBusinessInfo(), seed()

### Community 16 - "Community 16"
Cohesion: 0.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 0.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 0.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 0.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 0.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 0.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 0.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 0.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 0.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 0.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 0.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 0.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 0.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 0.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 0.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 0.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 0.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 0.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 0.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 0.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 0.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 0.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 0.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 0.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 0.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 0.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 0.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 0.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 0.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 0.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 0.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 0.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 0.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 0.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 0.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 0.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 0.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 0.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 16`** (2 nodes): `layout.js`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `layout.js`, `AdminLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `page.js`, `AttendancePage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `page.js`, `AttendanceReportPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `page.js`, `AdminCustomersPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `page.js`, `CustomInquiriesAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `page.js`, `EmployeesPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `page.js`, `RegisterPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `upload.route.test.js`, `createRequest()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `HeroSection.jsx`, `HeroSection()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `ProductGallery.jsx`, `ProductGallery()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `ProductGrid.jsx`, `ProductGrid()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `CategoryCard()`, `CategoryCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `Providers.js`, `Providers()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `NewsletterForm.jsx`, `NewsletterForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `AdminSidebar()`, `AdminSidebar.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `proxy.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `next.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `vitest.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `test-delete.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `route.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `products.route.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `orders.route.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `response.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `sampleData.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `CustomInquiry.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Order.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Attendance.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `User.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `OrderSequence.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `ShopDay.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `InventoryLog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Invoice.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `GlobalSettings.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `Product.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Employee.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.