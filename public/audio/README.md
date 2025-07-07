# Demo Audio Files for Music Production Ninja

This directory contains demo audio samples for the sample pack generator.

## Structure

```
audio/
├── hip-hop/
│   ├── loops/
│   │   ├── boom-bap-90-01.mp3
│   │   ├── lofi-85-01.mp3
│   │   └── trap-92-01.mp3
│   ├── oneshots/
│   │   ├── kick-01.mp3
│   │   ├── snare-01.mp3
│   │   └── 808-01.mp3
│   └── previews/
│       └── melody-01.mp3
├── house/
│   ├── loops/
│   │   ├── deep-124-01.mp3
│   │   └── tech-126-01.mp3
│   ├── oneshots/
│   │   ├── kick-01.mp3
│   │   └── clap-01.mp3
│   └── previews/
│       └── chord-01.mp3
└── placeholder.mp3
```

## Source Notes

These are placeholder audio files for demonstration purposes. In a production environment, you would:

1. Upload high-quality sample files to Supabase Storage
2. Organize them by genre, type, and other metadata
3. Create a database schema to support searching and filtering samples

## Adding New Samples

To add new samples:
1. Create appropriate folder structure
2. Add MP3 files for audio preview
3. Update the audioManager.js file with references to new samples