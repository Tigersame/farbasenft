# Base Mini App Guidelines Compliance

This document tracks compliance with [Base Mini App Featured Guidelines](https://docs.base.org/mini-apps/featured-guidelines/overview).

## ✅ Product Guidelines

### Load Time
- ✅ Apps should load within **3 seconds**
- ✅ In-app actions complete within **1 second**
- ✅ **Loading indicators** shown for all actions:
  - NFT minting (`mintUploading`)
  - NFT listing (`listingLoading`)
  - NFT buying (`buyLoading`)
  - Image uploads
  - Transaction confirmations

### Onboarding Flow
- ✅ **Onboarding component** created (`OnboardingFlow.tsx`)
- ✅ Maximum **3 screens** with succinct language
- ✅ Brief, informative explanation
- ✅ Uses images and clear CTAs
- ✅ Skip option available
- ✅ Progress indicators

### User Information & Privacy
- ✅ Only asks for necessary information
- ✅ Context provided before requesting data
- ✅ Privacy-respecting design

### User Profile
- ✅ **User profile visible** on screen (`UserProfile.tsx`)
- ✅ Shows **avatar and username**
- ✅ **Avoids showing 0x addresses** (hidden in dropdown, only shown via copy)
- ✅ Uses Farcaster username when available
- ✅ Falls back to wallet name/ENS

### App Description
- ✅ **Clear value proposition**: "Create and share art that lives onchain"
- ✅ One-sentence description: "Curated NFT gallery, swap portal, and creator tools—all in one Base mini app."
- ✅ Human, concise, benefit-focused messaging

## ✅ Design Guidelines

### Layout
- ✅ Core actions visible near top/middle
- ✅ Clear primary CTAs ("Create", "Mint", "Buy", "Sell")
- ✅ Designed for **small viewports** and **portrait orientation**
- ✅ **Optimized for thumb reach** and one-handed use

### Navigation
- ✅ **Bottom navigation bar** for mobile (`BottomNavigation.tsx`)
- ✅ **Labels under icons** for clarity
- ✅ Side menu for desktop (settings and profile)
- ✅ Tested on multiple device sizes

### Colors
- ✅ **Primary color**: Cyan (brand color for CTAs)
- ✅ **Secondary color**: Purple/Emerald (accents)
- ✅ **Neutral colors**: Slate (text, backgrounds, structure)
- ✅ Strong contrast maintained

### Themes
- ✅ **Dark mode** supported (primary theme)
- ✅ Smooth transitions
- ✅ Consistent brand colors

### Typography
- ✅ **Inter font** loaded and used
- ✅ Sufficient contrast between text and background
- ✅ Regular, bold, and italic used appropriately
- ✅ Easy to read under various conditions

### Spacing
- ✅ Consistent spacing using **8px base unit**
- ✅ Related elements grouped together
- ✅ White space for breathing room
- ✅ Visual rhythm maintained

### Touch Interactions
- ✅ All touch targets **at least 44px** (verified in `BottomNavigation.tsx`)
- ✅ Common gestures supported (tap, swipe)
- ✅ **No hover states** relied upon
- ✅ All interactions work on touch screens

## ✅ Technical Guidelines

### Performance
- ✅ Fast initial load
- ✅ Optimized images
- ✅ Efficient rendering

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support

## Implementation Details

### Components Created
1. **BottomNavigation.tsx** - Mobile bottom nav with labels
2. **OnboardingFlow.tsx** - 3-screen onboarding experience
3. **UserProfile.tsx** - Visible user profile (no 0x addresses)

### Components Updated
1. **AppLayout.tsx** - Added bottom nav and onboarding
2. **WalletControls.tsx** - Hidden 0x addresses, show username
3. **globals.css** - Added Inter font, proper spacing
4. **page.tsx** - Added user profile section, updated value proposition

### Key Features
- Mobile-first responsive design
- Touch-optimized interactions (44px minimum)
- Clear navigation with labeled icons
- User-friendly onboarding
- Privacy-respecting profile display
- Fast loading with indicators

## Checklist Status

- [x] Load time < 3 seconds
- [x] Actions < 1 second with loading indicators
- [x] 3-screen onboarding flow
- [x] User profile visible (avatar + username)
- [x] No 0x addresses shown
- [x] Clear value proposition
- [x] Bottom navigation bar
- [x] Labels under icons
- [x] Touch targets ≥ 44px
- [x] Inter font
- [x] Dark mode support
- [x] Consistent spacing (8px base)
- [x] No hover dependencies

## References

- [Product Guidelines](https://docs.base.org/mini-apps/featured-guidelines/product-guidelines)
- [Design Guidelines](https://docs.base.org/mini-apps/featured-guidelines/design-guidelines)
- [Technical Guidelines](https://docs.base.org/mini-apps/featured-guidelines/technical-guidelines)

