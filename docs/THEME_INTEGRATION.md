# Theme System Integration

## Overview

The Alsenda portfolio now has two theme systems that work together without conflicts:

1. **Preset Themes** - Managed by ThemeToggle component
2. **AI-Generated Custom Themes** - Managed by ThemeProvider + ThemeControlPanel

## How They Work Together

### Preset Themes (EGA, CRT, TRON, LIGHT)

**Component**: `src/components/ThemeToggle.tsx`  
**Storage Key**: `alsenda-theme`  
**Mechanism**: Sets `data-theme` attribute on `<html>` element

The theme toggle cycles through 4 built-in preset themes:
- **EGA**: Default CRT/EGA retro theme (cyan/magenta accents)
- **CRT**: Monochrome green CRT terminal look
- **TRON**: Electric blue/orange futuristic grid
- **LIGHT**: Bright, high-contrast light mode

These presets are defined in `src/app/globals.css` using `html[data-theme="..."]` selectors.

### AI-Generated Custom Theme

**Components**: 
- `src/components/ThemeProvider.tsx` - Applies theme via CSS variables
- `src/components/ThemeControlPanel.tsx` - UI for generating themes

**Storage Key**: `alsenda-custom-theme`  
**Mechanism**: Sets CSS variables on `:root` element

Users can generate custom themes by describing what they want:
- "light theme with blue and orange"
- "dark cyberpunk with neon purple"
- "sunset theme with warm colors"

The AI (or heuristic fallback) generates theme tokens that are applied at runtime.

## Integration Logic

### 1. Theme Toggle Detects Custom Theme

When a custom AI theme exists in localStorage:
- ThemeToggle adds "CUSTOM" as a 5th option
- User can cycle: EGA → CRT → TRON → LIGHT → CUSTOM → EGA...

### 2. No Conflicts Between Systems

**ThemeProvider** (AI themes):
- Only sets CSS variables (`--background`, `--foreground`, `--ega-cyan`, etc.)
- Does NOT set `data-theme` attribute
- Loads from `alsenda-custom-theme` key

**ThemeToggle** (Preset themes):
- Only sets `data-theme` attribute
- Does NOT touch CSS variables
- Loads from `alsenda-theme` key

### 3. Switching Between Them

**Preset → Preset**: Instant, no reload needed  
**Preset → Custom**: Reloads page to let ThemeProvider initialize  
**Custom → Preset**: Instant, `data-theme` overrides CSS variables  
**Preset (any) → Custom again**: Reloads to reapply stored theme

### 4. Reset Custom Theme

Clicking "Reset to Default Theme" in ThemeControlPanel:
- Clears `alsenda-custom-theme` from localStorage
- Reapplies DEFAULT_THEME CSS variables
- ThemeToggle detects removal and removes CUSTOM option
- User is back on whichever preset theme was active

## CSS Variable Priority

The CSS cascade ensures preset themes can override AI-generated themes:

```css
:root {
  --background: #222326;  /* Default */
}

/* AI theme sets inline style on :root */
/* (higher specificity) */

html[data-theme='light'] {
  --background: #f5f7fa !important;  /* Preset overrides */
}
```

## Motion Toggle

**Component**: In `src/app/layout.tsx` (rendered as `#motion-toggle` button)  
**Storage Key**: `alsenda-reduce-motion`  
**Mechanism**: Sets `data-reduce-motion` attribute on `<html>`

This is independent of both theme systems and should work correctly now.

## Developer Notes

### Adding New Preset Themes

1. Add entry to `presetThemes` array in `ThemeToggle.tsx`
2. Define CSS rules in `globals.css`:
   ```css
   html[data-theme='your-theme'] {
     --background: ...;
     --foreground: ...;
   }
   ```

### Modifying AI Theme Generation

1. Update system prompt in `src/app/api/theme-generator/route.ts`
2. Adjust heuristic fallback logic if needed
3. Add new fields to `ThemeTokens` type in `src/lib/theme.ts`
4. Update `ThemeProvider.applyThemeToDom()` to handle new fields

### Testing Theme Integration

1. Generate a custom theme using AI Theme Shaper
2. Verify CUSTOM appears in theme toggle
3. Cycle through all presets - they should work
4. Switch back to CUSTOM - should reload and apply custom theme
5. Reset custom theme - CUSTOM option should disappear
6. Motion toggle should work throughout

## Troubleshooting

### Theme toggle not showing CUSTOM option
- Check localStorage for `alsenda-custom-theme` key
- ThemeToggle polls every 1 second, wait a moment after generation

### Custom theme not applying
- Check browser console for errors
- Verify `alsenda-theme` is set to 'custom'
- Try hard refresh (Ctrl+Shift+R)

### Preset theme not overriding custom theme
- This is expected - preset themes should take priority
- CSS specificity should handle this automatically

### Motion toggle not working
- Check console for JavaScript errors
- Verify `#motion-toggle` button exists in DOM
- Check `data-reduce-motion` attribute on `<html>`
