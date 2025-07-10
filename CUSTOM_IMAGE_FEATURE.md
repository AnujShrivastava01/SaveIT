# Custom Image Feature Documentation

## Overview

The custom image feature allows users to add personalized images to their SaveIT cards, making it easier to visually identify and organize their saved items.

## How It Works

### Priority System

The card icon display follows this priority order:

1. **Custom Image** (highest priority) - User-provided image URL
2. **Social Media Icons** - LinkedIn, GitHub, Twitter specific icons
3. **Website Favicon** - Automatically fetched from the domain
4. **Default Globe Icon** (lowest priority) - Generic fallback

### Adding Custom Images

#### For New Items:

1. Click "Add Item" button
2. Fill in the required fields (Title, Content/URL, etc.)
3. In the "Custom Image URL" field, enter a direct link to an image
4. You'll see a live preview of the image
5. Save the item

#### For Existing Items:

1. Click the edit (pencil) icon on any card
2. Scroll to the "Custom Image URL" field
3. Enter or modify the image URL
4. Preview the image before saving
5. Click "Save Changes"

### Image Requirements

- Must be a direct URL to an image file
- Supported formats: PNG, JPG, JPEG, GIF, WebP, SVG
- Recommended size: 64x64 pixels or larger (will be automatically resized)
- Images should be publicly accessible (no authentication required)

### Examples of Good Image URLs:

```
https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png
https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png
```

### Database Changes

A new `custom_image` column has been added to the `saved_items` table:

```sql
ALTER TABLE saved_items
ADD COLUMN custom_image TEXT;
```

## Features

### Live Preview

- See how your custom image will look before saving
- Error handling for broken image URLs
- Automatic fallback if image fails to load

### Error Handling

- If a custom image fails to load, the system automatically falls back to the next priority (social icons, favicon, or globe)
- Broken images are hidden gracefully without breaking the UI

### Responsive Design

- Images are automatically sized to 20x20 pixels (w-5 h-5) for consistency
- Images maintain aspect ratio with object-cover
- Rounded corners for a polished look

## Use Cases

### Brand Recognition

- Add company logos for work-related links
- Use technology icons for coding resources
- Personal branding for portfolio items

### Visual Organization

- Color-coded icons for different types of content
- Consistent imagery for related topics
- Enhanced visual scanning of your collection

### Examples

- **React Tutorial**: Use React logo
- **Company Documentation**: Use company logo
- **Personal Blog**: Use your avatar or personal logo
- **Design Resources**: Use design tool icons (Figma, Adobe, etc.)
- **Social Media**: Use platform-specific icons

## Technical Implementation

### Frontend Updates

- Added `customImage` field to form states
- Updated `getIconForItem()` function with priority system
- Added live preview functionality
- Enhanced error handling for failed image loads

### Backend Updates

- Extended `SavedItem` interface with optional `customImage` field
- Database migration to add `custom_image` column
- Automatic handling in create/update operations

### Performance Considerations

- Images are loaded on-demand
- Failed images don't block the UI
- Lightweight implementation with minimal overhead
