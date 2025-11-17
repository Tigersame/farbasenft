# Pinata IPFS Setup

## Issue: IPFS Upload Failing (500 Error)

If you're seeing `IPFS upload error: Upload failed` with a 500 status code, it's because Pinata credentials are not configured.

## Setup Instructions

### 1. Get Pinata Credentials

1. Go to [Pinata](https://www.pinata.cloud/)
2. Sign up or log in
3. Navigate to **API Keys** in your dashboard
4. Create a new API key with the following permissions:
   - `pinFileToIPFS` - Required for uploading files
   - `pinJSONToIPFS` - Required for uploading metadata

### 2. Get Your JWT Token

1. In Pinata dashboard, go to **API Keys**
2. Click on your API key
3. Copy the **JWT** token (starts with `eyJ...`)

### 3. Add to Environment Variables

Add the following to your `.env.local` file:

```env
PINATA_JWT=your_jwt_token_here
```

**Example:**
```env
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZWVkZWVkZWVkZWVkZWVkZWVkZWVkZWVkZWVkZWVkZSIsInVzZXJuYW1lIjoieW91cl91c2VybmFtZSIsImVtYWlsIjoieW91ckBlbWFpbC5jb20ifSwiaWF0IjoxNjAwMDAwMDAwfQ.example_signature
```

### 4. Restart Development Server

After adding the environment variable, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Alternative: Legacy API Keys (Not Recommended)

If you're using legacy API keys instead of JWT:

```env
PINATA_API_KEY=your_api_key
PINATA_SECRET_API_KEY=your_secret_api_key
```

However, **JWT tokens are recommended** as they're more secure and easier to manage.

## Testing

After setup, try uploading an NFT image:
1. Go to the Mint NFT section
2. Select an image
3. Fill in name and description
4. Click "Upload to IPFS"
5. You should see a success message with an IPFS hash

## Troubleshooting

### Error: "PINATA_JWT is not configured"
- Make sure `.env.local` exists in the `farbasenft` directory
- Verify the variable name is exactly `PINATA_JWT`
- Restart the dev server after adding the variable

### Error: "Pinata upload failed: Unauthorized"
- Check that your JWT token is correct
- Verify the token hasn't expired
- Ensure the API key has the required permissions

### Error: "Pinata upload failed: Rate limit exceeded"
- You've hit Pinata's rate limit
- Wait a few minutes and try again
- Consider upgrading your Pinata plan for higher limits

## Free Tier Limits

Pinata's free tier includes:
- 1 GB storage
- Unlimited requests (with rate limits)
- Public gateway access

For production use, consider upgrading to a paid plan.

## Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [Pinata API Reference](https://docs.pinata.cloud/api-reference)
- [Pinata Dashboard](https://app.pinata.cloud/)

