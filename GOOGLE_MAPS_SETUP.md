# Google Maps API Setup Instructions

## Problem
Getting `InvalidKeyMapError` when using Google Places Autocomplete

## Solution

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create or Select a Project
- If you don't have a project, create a new one
- If you have one, select it from the dropdown

### Step 3: Enable Required APIs
Go to **APIs & Services** > **Library** and enable:
1. **Maps JavaScript API**
2. **Places API** (formerly Google Places API Web Service)

### Step 4: Create or Update API Key
Go to **APIs & Services** > **Credentials**

#### Create New Key (Recommended):
1. Click "**+ CREATE CREDENTIALS**" > "**API key**"
2. A new API key will be generated
3. Copy the API key

#### Configure the API Key:
1. Click "**Edit**" (pencil icon) on your API key
2. Under "**API restrictions**":
   - Select "**Restrict key**"
   - Check these APIs:
     - ✅ Maps JavaScript API
     - ✅ Places API
3. Under "**Application restrictions**":
   - For development: Select "**None**"
   - For production: Select "**HTTP referrers (web sites)**" and add:
     - `http://localhost:*`
     - `https://yourdomain.com/*`
4. Click "**SAVE**"

### Step 5: Update Your .env File
Replace the old API key with your new one:

```env
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_NEW_API_KEY_HERE"
```

### Step 6: Restart Your Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 7: Test
1. Go to http://localhost:3001/profile
2. Scroll to "Residence (Italy)" section
3. Start typing in the "Search Address" field
4. You should see Google Places autocomplete suggestions!

## Troubleshooting

### Still getting errors?
Check the browser console for the exact error message:
- `InvalidKeyMapError` = API key issue (follow steps above)
- `ApiNotActivatedMapError` = API not enabled (enable APIs in step 3)
- `RefererNotAllowedMapError` = Domain restriction issue (update referrers in step 4)

### API Key best practices:
- ✅ Restrict to specific APIs (Maps JavaScript API + Places API)
- ✅ Set HTTP referrer restrictions in production
- ✅ Monitor usage in Google Cloud Console
- ✅ Set up billing alerts
- ❌ Never commit API keys to public repositories

## Cost Information
- Google Maps Platform offers $200 free credit per month
- Places Autocomplete: $2.83 per 1,000 sessions
- Most development usage stays within free tier

## Links
- [Google Maps Platform](https://console.cloud.google.com/google/maps-apis)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
