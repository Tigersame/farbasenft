# Previewing Your Mini App in Warpcast

## Quick Preview Guide

According to the [Farcaster Mini Apps Loading Guide](https://miniapps.farcaster.xyz/docs/guides/loading), you can preview your app directly in Warpcast using the Mini App Debug Tool.

## Steps to Preview

1. **Enable Developer Mode** (if not already enabled)
   - Go to: https://farcaster.xyz/~/settings/developer-tools
   - Toggle "Developer Mode" ON
   - You must be logged into your Warpcast account on desktop

2. **Open Mini App Debug Tool**
   - On Warpcast desktop, you'll see a developer section on the left
   - Click on "Mini App Debug Tool" or navigate to it

3. **Enter Your App URL**
   - For local development: `http://localhost:3000`
   - For production: Your deployed URL (e.g., `https://your-app.vercel.app`)

4. **Hit Preview**
   - Click the "Preview" button
   - Your app will open in a preview window
   - You can test all Farcaster features here

## What You'll See

When previewing:
- ✅ Splash screen will show (configured in your manifest)
- ✅ App will load and call `ready()` to hide splash
- ✅ All Farcaster features will work
- ✅ User context will be available
- ✅ You can test casting, sharing, etc.

## Testing Loading Performance

The debug tool is perfect for testing:
- **Loading time** - How fast your app loads
- **Splash screen** - How it looks and behaves
- **Content reflow** - Whether content shifts when splash hides
- **Jitter** - Any visual glitches during loading

## Best Practices

Based on the [loading guide](https://miniapps.farcaster.xyz/docs/guides/loading):

1. **Call ready() at the right time**
   - When interface is ready (not too early, not too late)
   - After initial content has loaded
   - Before user interaction is needed

2. **Avoid jitter and reflow**
   - Use skeleton states for loading content
   - Don't call ready() until interface has loaded
   - Test in the debug tool to see loading behavior

3. **Optimize performance**
   - Minimize loading time
   - Use web performance best practices
   - Test with the debug tool

## Troubleshooting

### Preview not working?
- Make sure Developer Mode is enabled
- Check you're logged into Warpcast on desktop
- Verify your app URL is accessible
- Check browser console for errors

### Splash screen not showing?
- Check your manifest configuration
- Verify splash image URLs are accessible
- Check `.well-known/farcaster.json` endpoint

### App not calling ready()?
- Check browser console for errors
- Verify SDK is initialized correctly
- Make sure you're in a Mini App context

## Next Steps

After previewing:
1. Test all features in the preview
2. Check loading performance
3. Verify splash screen behavior
4. Test on mobile Warpcast app
5. Deploy and test in production

Happy previewing! 🚀

