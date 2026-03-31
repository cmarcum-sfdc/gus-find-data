# GUS Finder

A macOS desktop application for querying Salesforce GUS (Global User Stories) work items and epics.

## Features

- 🔐 Secure Salesforce authentication
- 🔍 Search and filter work items and epics
- 📊 View detailed information about GUS items
- 🎨 Clean, modern user interface
- ⚡ Fast, native performance with Electron

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Salesforce account with GUS access
- Salesforce Security Token

## Getting Your Salesforce Security Token

1. Log in to Salesforce
2. Click on your profile picture → Settings
3. In the left sidebar: Personal → Reset My Security Token
4. Click "Reset Security Token"
5. Check your email for the new security token

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Start the app:
```bash
npm start
```

## Development

For development with hot reload:

```bash
npm run dev
```

This will start webpack in watch mode and launch the Electron app.

## Building for Distribution

To create a distributable macOS app:

```bash
npm run package
```

This will create a `.dmg` file in the `dist` folder.

## Usage

### Login

1. Enter your Salesforce credentials:
   - Username (email)
   - Password
   - Security Token
   - Instance URL (default: https://login.salesforce.com)

2. Click "Login"

### Searching Work Items

1. Click the "Work Items" tab
2. Use the search filters:
   - **Search Text**: Find items by name or subject
   - **Status**: Filter by status (New, In Progress, Completed, etc.)
   - **Priority**: Filter by priority (P0-P3)
   - **Assignee**: Filter by assignee name
3. Click "Search"

### Searching Epics

1. Click the "Epics" tab
2. Use the search filters:
   - **Search Text**: Find epics by name or description
   - **Status**: Filter by status
   - **Priority**: Filter by priority
3. Click "Search"

## Project Structure

```
gus-find-data/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts           # Main entry point
│   │   ├── preload.ts        # Preload script for IPC
│   │   └── salesforceAuth.ts # Salesforce authentication service
│   └── renderer/             # React UI
│       ├── components/       # React components
│       ├── App.tsx           # Main app component
│       ├── index.tsx         # React entry point
│       ├── styles.css        # Global styles
│       └── types.d.ts        # TypeScript definitions
├── dist/                     # Build output
├── package.json
├── tsconfig.json
├── webpack.main.config.js    # Webpack config for main process
└── webpack.renderer.config.js # Webpack config for renderer
```

## Configuration

### GUS Object Names

The app uses these default Salesforce object names:
- Work Items: `ADM_Work__c`
- Epics: `ADM_Epic__c`

If your GUS installation uses different object names (e.g., with namespace prefixes like `agf__ADM_Work__c`), you'll need to update them in `src/main/salesforceAuth.ts`.

### Field Names

The following GUS fields are queried:
- Work Items: `Subject__c`, `Status__c`, `Priority__c`, `Assignee__c`, `Epic__c`, `Sprint__c`, `Type__c`, `Details_and_Steps_to_Reproduce__c`
- Epics: `Name`, `Status__c`, `Priority__c`, `Description__c`, `Target_Date__c`

Adjust these in `salesforceAuth.ts` if your field names differ.

## Troubleshooting

### Authentication Issues

- Verify your security token is correct and hasn't expired
- Ensure you're using the correct instance URL
- Check that your Salesforce user has appropriate permissions for GUS

### Query Errors

- The object names (`ADM_Work__c`, `ADM_Epic__c`) may differ in your org
- Field names may have namespace prefixes (e.g., `agf__Status__c`)
- Check the browser console (View → Toggle Developer Tools) for detailed error messages

### No Results Found

- Try clearing filters and searching again
- Verify that you have access to GUS objects in Salesforce
- Check that work items/epics exist in your org

## License

MIT
