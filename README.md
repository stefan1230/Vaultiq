# Debt Tracker — React App

A cloud-connected personal financial ledger for tracking credit card debt and savings goals.

## Features
- 🔐 Supabase authentication & cloud sync
- 💳 Track multiple credit card balances with monthly statements
- 📊 Automatic interest calculation
- 💰 Savings goals with deposit/withdrawal tracking
- 📦 JSON backup & restore
- 📱 Mobile-first responsive design

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## Configuration

Supabase credentials are pre-configured in `src/utils/supabase.js`. To use your own instance:

1. Create a project at [supabase.com](https://supabase.com)
2. Create a `user_financial_states` table with columns:
   - `user_id` (text, primary key)
   - `payload` (jsonb)
   - `updated_at` (timestamptz)
3. Update `SUPABASE_URL` and `SUPABASE_KEY` in `src/utils/supabase.js`

## Project Structure

```
src/
├── components/
│   ├── AuthScreen.jsx     # Login screen
│   ├── AccountCard.jsx    # Credit card liability card
│   ├── SavingsPanel.jsx   # Savings goals panel
│   └── StatCard.jsx       # Summary stat card
├── hooks/
│   └── useDB.js           # IndexedDB state hook
├── utils/
│   ├── db.js              # IndexedDB helpers
│   ├── supabase.js        # Supabase client & sync
│   └── format.js          # Number/date formatters
├── App.jsx                # Main app component
└── index.js               # Entry point
```

## Data Storage

- **Local**: IndexedDB (works offline)
- **Cloud**: Supabase (synced on every change when authenticated)
