# DayDream-000

**A Node.js-powered DayDreamX proxy fork optimized for Railway deployment.**

## Features

- ✅ Cloaking
- ✅ Tabs
- ✅ History
- ✅ Theming
- ✅ Bookmarks
- ✅ Proxies
- ✅ Games
- ✅ WISP Protocol Support
- ✅ Multiple Transport Options (Ultraviolet, Libcurl, Epoxy)

## Setup Locally

### Prerequisites
- Node.js >= 16.0.0
- npm >= 7.0.0

### Installation

```bash
git clone https://github.com/totosou/daydream-000.git
cd daydream-000
npm install
npm start
```

The server will run on `http://localhost:8080`

## Deployment on Railway

1. Connect your GitHub repo to [Railway.app](https://railway.app)
2. Create a new project and select this repository
3. Railway will auto-detect the Node.js environment
4. Set the start command to: `npm start`
5. Deploy!

### Environment Variables

- `PORT` - Server port (default: 8080)

## File Structure

```
.
├── index.js                 # Main Express server
├── srv/
│   └── router.js           # API routes
├── public/
│   ├── pages/              # HTML pages
│   └── static/             # Static assets
├── package.json
└── README.md
```

## License

AGPL-3.0-only (Same as DayDreamX)

## Based On

- [NxroProxy/DayDreamX](https://github.com/NxroProxy/DayDreamX)
- [Ultraviolet](https://github.com/titaniumnetwork-dev/ultraviolet)
