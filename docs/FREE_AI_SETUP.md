# Free AI Theme Generator Setup

The theme generator now uses **FREE** alternatives to avoid OpenAI rate limits and costs.

## Option 1: Use Smart Mock AI (Default - No API Key Needed)

The app now has an enhanced smart theme generator that works **without any API key**. It includes:

✅ Extended mood presets (cyberpunk, sunset, forest, ocean, **mediterranean**, **coastal**, **summer**)  
✅ 50+ color keyword detection (blue, azure, terracotta, sand, sage, coral, etc.)  
✅ Smart light/dark theme detection  
✅ Intelligent color extraction and analysis  

**No setup required** - just use it! Try descriptions like:
- "coastal Mediterranean town during summer"
- "light theme with azure blue and sandy gold"
- "dark forest with emerald and sage green"

## Option 2: Enable Hugging Face AI (Free Tier)

For AI-powered generation with more flexibility:

### Step 1: Get a Free Hugging Face Token

1. Go to [huggingface.co](https://huggingface.co)
2. Create a free account (no credit card required)
3. Navigate to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Name it (e.g., "alsenda-theme-generator")
6. Select "Read" permissions
7. Click "Generate token"
8. Copy the token (starts with `hf_...`)

### Step 2: Configure Your Environment

Edit `.env` file:

```properties
# Enable Hugging Face AI
HUGGINGFACE_API_KEY=hf_your_token_here

# Disable mock AI (optional - remove or set to false)
USE_MOCK_AI=false
```

### Step 3: Restart Your Dev Server

```bash
npm run dev
```

## What Changed?

### Removed:
- ❌ OpenAI API (caused 429 rate limit errors and costs money)

### Added:
- ✅ Hugging Face free inference API (uses Mistral-7B-Instruct)
- ✅ Enhanced smart mock with mediterranean/coastal/summer presets
- ✅ 50+ color keywords for better detection
- ✅ Better light theme support
- ✅ Request deduplication to prevent multiple API calls

## Testing the Mediterranean Theme

Try this description:
```
I want you to have the look & feel of a coastal Mediterranean town during summer.
```

**With mock AI**, it will:
1. Detect "mediterranean" or "coastal" mood → use preset
2. If no mood detected, extract colors like "blue", "sand", "white"
3. Detect "summer" keyword → apply warm, bright theme
4. Create a light theme with appropriate colors

**Result**: Beautiful light theme with azure blues, sandy golds, and warm earth tones! 🌊☀️

## Free Tier Limits

- **Smart Mock**: Unlimited, works offline
- **Hugging Face**: 1000+ requests/day on free tier (very generous)

## Troubleshooting

### "Generation failed" error
- If using Hugging Face: Check your API key is correct
- Model might be loading (first request can be slow)
- Falls back to smart mock automatically

### Theme doesn't match description
- Smart mock uses keyword matching
- Add more specific color names
- Try mood keywords: cyberpunk, sunset, forest, ocean, mediterranean, coastal, summer

### Still getting rate limits
- Check `.env` has `USE_MOCK_AI=true`
- Ensure no `OPENAI_API_KEY` is set
- Restart dev server after changing `.env`

## Cost Comparison

| Provider | Cost | Rate Limit | Setup |
|----------|------|------------|-------|
| OpenAI | $0.15-$15/million tokens | 3-500 req/min | Credit card required |
| Hugging Face | **FREE** | 1000+ req/day | Email signup only |
| Smart Mock | **FREE** | Unlimited | None |

Choose what works best for your needs!
