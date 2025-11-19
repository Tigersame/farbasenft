# Menu Bar Integration Map - All 9 Buttons

## Overview
This document maps each of the 9 sidebar menu buttons to their respective sections and functionality.

## Menu Button Mapping (1-to-1 Integration)

### 1. ✅ Dashboard
- **Button ID**: `dashboard`
- **Section**: `dashboard`
- **Hash Route**: `#dashboard`
- **Behavior**: Full-page dashboard view with statistics, trading history, and analytics
- **Visibility**: Only visible when `activeSection === "dashboard"` (hides all other sections)
- **Components Shown**: Dashboard component with stats cards, trading history, activity charts
- **Click Handler**: `handleSectionSelect("dashboard")` → `window.location.hash = "dashboard"`

### 2. ✅ NFT Gallery
- **Button ID**: `nft`
- **Label**: `NFT Gallery`
- **Section**: `gallery`
- **Hash Route**: `#` (empty/default)
- **Behavior**: Shows default view with all content sections
- **Visibility**: Shown when `activeSection === null` or `activeSection === "gallery"`
- **Sections Visible**: Profile, XP System, FarbaseMint Gallery, Marketplace, Curator Notes, Swap, NFT Experience
- **Click Handler**: `handleSectionSelect("gallery")` → `window.location.hash = ""`

### 3. ✅ FarbaseMint Gallery
- **Button ID**: `farbasemint`
- **Label**: `FarbaseMint Gallery`
- **Section**: `farbasemint-gallery`
- **Hash Route**: `#farbasemint-gallery`
- **Behavior**: Shows focused view of FarbaseMint NFT gallery with virtual scrolling
- **Visibility**: Shown when `activeSection === null` or `activeSection === "farbasemint-gallery"`
- **Components Shown**: FarbaseMintNFTGallery with tabs (live, trending, hot, new)
- **Click Handler**: `handleSectionSelect("farbasemint-gallery")` → `window.location.hash = "farbasemint-gallery"`
- **Scroll**: Auto-scrolls to `#farbasemint-gallery` element

### 4. ✅ Mint NFT
- **Button ID**: `nft-mint`
- **Label**: `Mint NFT`
- **Type**: Direct navigation (href)
- **Route**: `/mint`
- **Behavior**: Navigates to dedicated mint page
- **Visibility**: Always available
- **Click Handler**: Direct link navigation via `Next/Link`

### 5. ✅ Buy NFT
- **Button ID**: `nft-buy`
- **Label**: `Buy NFT`
- **Section**: `buy`
- **Hash Route**: `#nft-experience` (with buy panel context)
- **Behavior**: Shows NFT Experience section with Buy context
- **Visibility**: Shown when `activeSection === null` or `activeSection === "buy"`
- **Components Shown**: NFTActions component (focused on buying)
- **Panel Context**: Dispatches panel event with `panel: "buy"`
- **Click Handler**: `handleSectionSelect("buy")` → triggers panel event + `window.location.hash = "nft-experience"`
- **Scroll**: Auto-scrolls to `#nft-experience` element

### 6. ✅ Sell NFT
- **Button ID**: `nft-sell`
- **Label**: `Sell NFT`
- **Section**: `sell`
- **Hash Route**: `#nft-experience` (with list panel context)
- **Behavior**: Shows NFT Experience section with Sell/List context
- **Visibility**: Shown when `activeSection === null` or `activeSection === "sell"`
- **Components Shown**: NFTActions component (focused on selling/listing)
- **Panel Context**: Dispatches panel event with `panel: "list"` (maps sell → list)
- **Click Handler**: `handleSectionSelect("sell")` → triggers panel event + `window.location.hash = "nft-experience"`
- **Scroll**: Auto-scrolls to `#nft-experience` element

### 7. ✅ Listings
- **Button ID**: `nft-list`
- **Label**: `Listings`
- **Section**: `listings`
- **Hash Route**: `#nft-experience` (with list panel context)
- **Behavior**: Shows NFT Experience section with Listings context
- **Visibility**: Shown when `activeSection === null` or `activeSection === "listings"`
- **Components Shown**: NFTActions component (viewing active listings)
- **Panel Context**: Dispatches panel event with `panel: "list"`
- **Click Handler**: `handleSectionSelect("listings")` → triggers panel event + `window.location.hash = "nft-experience"`
- **Scroll**: Auto-scrolls to `#nft-experience` element

### 8. ✅ Swap
- **Button ID**: `nft-swap`
- **Label**: `Swap`
- **Section**: `swap`
- **Hash Route**: `#swap-portal`
- **Behavior**: Shows Swap Portal section with token swap functionality
- **Visibility**: Shown when `activeSection === null` or `activeSection === "swap"`
- **Components Shown**: SwapWrapper with ETH, USDC, WETH, DEGEN, DAI tokens
- **Features**: Best rate aggregator, XP rewards, Base L2 optimization
- **Click Handler**: `handleSectionSelect("swap")` → `window.location.hash = "swap-portal"`
- **Scroll**: Auto-scrolls to `#swap-portal` element

### 9. ✅ Search (Marketplace)
- **Button ID**: `nft-search`
- **Label**: `Search`
- **Section**: `marketplace`
- **Hash Route**: `#marketplace`
- **Behavior**: Shows Marketplace section with live & trending drops
- **Visibility**: Shown when `activeSection === null` or `activeSection === "marketplace"`
- **Components Shown**: Live & Trending Drops gallery with NFT cards
- **Card Features**: Category badges, reserve price, status, Farcaster share button
- **Click Handler**: `handleSectionSelect("marketplace")` → `window.location.hash = "marketplace"`
- **Scroll**: Auto-scrolls to `#marketplace` element

---

## Section Visibility Logic

### Default State (null)
When `activeSection === null`:
- ✅ User Profile
- ✅ XP System (XPDisplay + SBTClaim)
- ✅ FarbaseMint Gallery
- ✅ Marketplace (Live & Trending)
- ✅ Curator Notes
- ✅ Swap Portal
- ✅ NFT Experience
- ❌ Dashboard (hidden)

### Dashboard Section
When `activeSection === "dashboard"`:
- ❌ User Profile
- ❌ XP System
- ❌ FarbaseMint Gallery
- ❌ Marketplace
- ❌ Curator Notes
- ❌ Swap Portal
- ❌ NFT Experience
- ✅ Dashboard (full page)

### Focused Sections
- **Gallery** (`activeSection === "gallery"`): Shows default view (same as null)
- **FarbaseMint** (`activeSection === "farbasemint-gallery"`): Shows all default + highlights FarbaseMint Gallery
- **Marketplace** (`activeSection === "marketplace"`): Shows all default + highlights Marketplace
- **Swap** (`activeSection === "swap"`): Shows all default + highlights Swap Portal
- **Buy/Sell/Listings** (`activeSection === "buy"`, `"sell"`, or `"listings"`): Shows all default + highlights NFT Experience

---

## Event Flow Architecture

### 1. User Clicks Menu Button
```typescript
Button clicked → handleSectionSelect(section)
```

### 2. Sidebar Dispatches Events
```typescript
window.dispatchEvent(
  new CustomEvent<{ section: string }>(SIDEBAR_SECTION_EVENT, {
    detail: { section },
  })
);
```

### 3. Page Listens for Events
```typescript
window.addEventListener(SIDEBAR_SECTION_EVENT, (event) => {
  const section = event.detail?.section;
  setActiveSection(section);
});
```

### 4. Hash Changes
```typescript
window.location.hash = "#target-section";
```

### 5. Page Listens for Hash Changes
```typescript
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1);
  const section = hashMap[hash];
  setActiveSection(section);
  
  // Scroll to section
  const element = document.getElementById(hash);
  if (element) element.scrollIntoView({ behavior: "smooth" });
});
```

### 6. Conditional Rendering
```typescript
{showDashboard && <Dashboard />}
{showFarbaseMintGallery && <FarbaseMintGallery />}
{showMarketplace && <Marketplace />}
// ... etc
```

---

## Testing Checklist

### Button Functionality
- [ ] Dashboard button - Clicks → Full page dashboard shown, other sections hidden
- [ ] NFT Gallery button - Clicks → Default view with all sections
- [ ] FarbaseMint Gallery button - Clicks → Scrolls to FarbaseMint section
- [ ] Mint NFT button - Clicks → Navigates to `/mint` page
- [ ] Buy NFT button - Clicks → Scrolls to NFT Experience section
- [ ] Sell NFT button - Clicks → Scrolls to NFT Experience section (sell mode)
- [ ] Listings button - Clicks → Scrolls to NFT Experience section (listings mode)
- [ ] Swap button - Clicks → Scrolls to Swap Portal section
- [ ] Search button - Clicks → Scrolls to Marketplace section

### Hash Navigation
- [ ] Type `#dashboard` in URL → Dashboard shown
- [ ] Type `#farbasemint-gallery` in URL → Scrolls to FarbaseMint Gallery
- [ ] Type `#nft-experience` in URL → Scrolls to NFT Experience
- [ ] Type `#swap-portal` in URL → Scrolls to Swap Portal
- [ ] Type `#marketplace` in URL → Scrolls to Marketplace
- [ ] Type nothing or `#` in URL → Default view shown

### Smooth Transitions
- [ ] Clicking buttons causes smooth scroll to sections
- [ ] Hash changes update URL without page reload
- [ ] Browser back/forward buttons work correctly
- [ ] activeSection state syncs with visible content

### XP & Wallet Integration
- [ ] Swap section shows XP rewards information
- [ ] All sections properly interact with wallet context
- [ ] Profile updates when wallet changes

---

## Code References

### Sidebar (src/components/SidebarWithStore.tsx)
- **Lines 188-196**: Static menu item definitions
- **Lines 215-245**: handleSectionSelect function
- **Lines 282-303**: Button rendering with click handlers

### Page (src/app/page.tsx)
- **Lines 110-152**: useEffect hooks for event/hash listening
- **Lines 154-162**: Visibility flag definitions
- **Lines 173-410**: Conditional rendering of sections

### Button click → hash → activeSection flow:
1. Button click triggers `handleSectionSelect(section)`
2. Event dispatched + hash updated
3. Page useEffect catches hashchange
4. activeSection state updated
5. Conditional rendering updates UI
6. Element scrollIntoView triggered

---

## Known Limitations & Future Enhancements

### Current Implementation
- Uses client-side event system and hash routing
- Mock data for all API endpoints
- No persistent state (resets on page reload for activeSection)

### Future Improvements
- [ ] Add URL query parameters for more complex state
- [ ] Implement real database queries for trading history
- [ ] Add deep linking support with scroll restoration
- [ ] Cache section state in localStorage
- [ ] Add loading states for section transitions
- [ ] Implement analytics tracking for menu usage

---

## Support & Debugging

### Section Not Showing?
1. Check browser console for errors
2. Verify `activeSection` value using React DevTools
3. Check if conditional rendering flag is true
4. Verify section ID matches hash

### Hash Not Updating?
1. Check if `window.location.hash` is being set
2. Verify handleSectionSelect is being called
3. Check browser console for errors
4. Try refreshing the page

### Scroll Not Working?
1. Verify section element has correct ID
2. Check if scrollIntoView is being called
3. Try setting timeout for async scroll
4. Check CSS for `scroll-behavior: smooth`
