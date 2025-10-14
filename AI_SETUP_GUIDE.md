
# AI Football Play Converter - Setup Guide

This guide will help you set up the full AI implementation for converting hand-drawn football plays to professional diagrams.

## Prerequisites

- A Supabase account and project
- An OpenAI API account with access to GPT-4 Vision and DALL-E 3
- Supabase CLI installed (optional, for local development)

## Step 1: Enable Supabase

1. **Press the Supabase button** in your Natively development environment
2. **Connect to your Supabase project** (or create a new one at https://supabase.com)
3. Note your project URL and anon key

## Step 2: Set Up Environment Variables

Create a `.env` file in your project root (if it doesn't exist):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase project credentials.

## Step 3: Deploy the Edge Function

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Create a new function**
4. Name it `convert-football-play`
5. Copy the code from `supabase/functions/convert-football-play/index.ts`
6. Paste it into the function editor
7. Click **Deploy**

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy convert-football-play
```

## Step 4: Add OpenAI API Key to Supabase Secrets

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. In your Supabase dashboard, go to **Project Settings** > **Edge Functions**
3. Scroll to **Secrets**
4. Add a new secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
5. Click **Save**

## Step 5: Test the Implementation

1. Run your app: `npm run dev`
2. Navigate to the Play Converter screen
3. Upload or take a photo of a hand-drawn football play
4. Click "Convert with AI"
5. Wait for the AI to analyze and generate the professional diagram

## How It Works

### Frontend Flow

1. User uploads/captures an image of a hand-drawn play
2. Image is converted to base64 format
3. App sends the base64 image to the Supabase Edge Function
4. App displays progress updates during conversion
5. Converted diagram is displayed and can be downloaded/shared

### Backend Flow (Edge Function)

1. Receives base64 image from the app
2. Calls OpenAI's GPT-4 Vision API to analyze the hand-drawn play
3. GPT-4 Vision identifies players, positions, routes, and formations
4. Calls DALL-E 3 to generate a professional diagram based on the analysis
5. Returns the generated diagram as base64 to the app

## Cost Considerations

- **GPT-4 Vision**: ~$0.01 per image analysis
- **DALL-E 3**: ~$0.04 per image generation
- **Total per conversion**: ~$0.05

For a production app, consider:
- Implementing rate limiting
- Adding user authentication
- Caching results
- Monitoring API usage

## Troubleshooting

### "Supabase not configured" error

- Make sure your `.env` file has the correct Supabase URL and anon key
- Restart your Expo development server after adding environment variables

### "OpenAI API key not configured" error

- Verify the secret is named exactly `OPENAI_API_KEY` in Supabase
- Redeploy the edge function after adding the secret

### "Vision API error" or "Image generation error"

- Check your OpenAI API key has access to GPT-4 Vision and DALL-E 3
- Verify your OpenAI account has sufficient credits
- Check the Supabase Edge Function logs for detailed error messages

### Image quality issues

- Ensure uploaded images are clear and well-lit
- Try adjusting the image quality settings in the ImagePicker configuration
- Consider adding image preprocessing (contrast, brightness adjustments)

## Next Steps

### Enhancements to Consider

1. **Add user authentication** to track conversions per user
2. **Store conversion history** in Supabase database
3. **Implement caching** to avoid re-converting the same plays
4. **Add play templates** for common formations
5. **Enable play editing** after conversion
6. **Generate actual PDFs** instead of PNG images
7. **Add play naming and categorization**
8. **Implement team/playbook management**

### Production Checklist

- [ ] Set up proper error tracking (e.g., Sentry)
- [ ] Implement rate limiting on the edge function
- [ ] Add user authentication
- [ ] Set up monitoring and alerts
- [ ] Create a privacy policy for image handling
- [ ] Implement image cleanup (delete temporary files)
- [ ] Add analytics to track conversion success rates
- [ ] Set up automated testing

## Support

For issues or questions:
- Check Supabase Edge Function logs
- Review OpenAI API documentation
- Check the Expo documentation for mobile-specific issues

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- Implement proper authentication before production
- Consider adding image validation to prevent abuse
- Monitor API usage to prevent unexpected costs
