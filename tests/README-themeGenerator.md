# Theme Generator Tests

This test suite validates the AI Theme Shaper functionality.

## Running Tests

### Prerequisites
Make sure the dev server is running:
```bash
npm run dev
```

### Run All Tests
```bash
npm test
```

### Run Theme Generator Tests Only
```bash
npm test themeGenerator
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Test Coverage

### Input Validation
- Rejects empty descriptions
- Rejects missing descriptions
- Rejects non-string descriptions

### Light Theme Generation
- Generates light themes when explicitly requested
- Handles "bright" keyword
- Uses appropriate light background colors (#e-f range)
- Uses dark foreground colors for contrast

### Dark Theme Generation
- Generates dark themes by default
- Uses appropriate dark background colors (#0-2 range)
- Uses light foreground colors for contrast

### Color Extraction
- Extracts blue from descriptions
- Extracts orange from descriptions
- Handles multiple color keywords
- Properly applies colors to accent fields (egaCyan, egaMagenta)

### Mood Presets
- Detects and uses "cyberpunk" preset
- Detects and uses "sunset" preset
- Detects and uses "ocean" preset
- Detects and uses "forest" preset

### Theme Structure
- Returns valid JSON structure
- All required color fields present
- RGB tuples in correct format (e.g., "34,211,238")
- Hex colors in correct format (e.g., "#0a0e1a")
- Includes optional effects
- Includes backgroundArt settings

### AI vs Heuristic
- Works when GOOGLEAI_API_KEY is not set (heuristic fallback)
- Uses AI when GOOGLEAI_API_KEY is present

### Edge Cases
- Handles very long descriptions
- Handles special characters and emojis
- Handles descriptions with no recognizable colors

## Test Environment Variables

- `API_BASE_URL`: Base URL for API calls (default: http://localhost:3000)
- `GOOGLEAI_API_KEY`: Google AI API key for AI-backed generation (optional)

## Manual Testing

To manually test the theme generator:

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Scroll to "AI Theme Shaper" section
4. Try these test cases:
   - "light theme with blue and orange"
   - "dark cyberpunk with neon purple"
   - "bright and airy theme with teal"
   - "sunset theme with warm colors"
   - "elegant light theme with coral and mint"

## Expected Behavior

### Light Themes
When you request a light theme:
- Background should be very light (#f5f7fa or similar)
- Text should be dark for contrast
- Accent colors should be properly applied
- Glow effects should be subtle

### Dark Themes
When you request a dark theme:
- Background should be very dark (#0a0e1a or similar)
- Text should be light for contrast
- Accent colors should be vibrant
- Glow effects should be more pronounced

### Color Specificity
When you mention specific colors:
- Those colors should appear in the generated theme
- Primary color → egaCyan
- Secondary color → egaMagenta
- Colors should be recognizable in the UI

## Troubleshooting

### Tests Failing
1. Make sure dev server is running on port 3000
2. Check that all dependencies are installed: `npm install`
3. Clear build cache: `rm -rf .next`

### AI Generation Not Working
1. Verify GOOGLEAI_API_KEY is set in `.env`
2. Check API key has sufficient credits
3. Check console for error messages
4. Tests should still pass with heuristic fallback

### Theme Not Applying
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try the Reset button
4. Hard refresh the page (Ctrl+Shift+R)
