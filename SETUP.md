# Setup Guide for Out of Office App

## Prerequisites Installation

### 1. Install Node.js

You need to install Node.js to run this application. Here are the steps:

#### Option A: Download from Official Website (Recommended)
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the installation wizard
4. Restart your terminal/PowerShell after installation

#### Option B: Using Chocolatey (if you have it installed)
```powershell
choco install nodejs
```

#### Option C: Using Winget (Windows Package Manager)
```powershell
winget install OpenJS.NodeJS
```

### 2. Verify Installation
After installation, restart your terminal and run:
```powershell
node --version
npm --version
```

Both commands should return version numbers.

## Application Setup

### 1. Install Dependencies
Once Node.js is installed, run:
```powershell
npm install
```

### 2. Azure App Registration Setup

#### Step 1: Create Azure App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in the details:
   - **Name**: Out of Office App
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:3000`
5. Click "Register"

#### Step 2: Get Configuration Values
After registration, note down:
- **Application (client) ID** - found on the Overview page
- **Directory (tenant) ID** - found on the Overview page

#### Step 3: Configure API Permissions
1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Add these permissions:
   - `User.Read`
   - `Calendars.ReadWrite`
   - `Mail.Send`
   - `User.ReadBasic.All`
6. Click "Grant admin consent" (requires admin privileges)

### 3. Environment Configuration

1. Copy the example environment file:
   ```powershell
   copy env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   REACT_APP_CLIENT_ID=your_actual_client_id
   REACT_APP_TENANT_ID=your_actual_tenant_id
   REACT_APP_MANAGER_EMAIL=your_manager@company.com
   ```

### 4. Start the Application

```powershell
npm start
```

The app will open at `http://localhost:3000`

## Troubleshooting

### Node.js Installation Issues
- If `node` or `npm` commands are not recognized after installation, restart your terminal
- If still not working, check if Node.js is in your system PATH
- You may need to run the installer as administrator

### Azure Configuration Issues
- Ensure you have admin access to grant API permissions
- Double-check the client ID and tenant ID are correct
- Verify the redirect URI matches exactly (including http://localhost:3000)

### Application Issues
- If you get build errors, try: `npm install` again
- Clear browser cache if authentication doesn't work
- Check browser console for detailed error messages

## Next Steps

Once the application is running:
1. Sign in with your Microsoft work account
2. Fill out the out-of-office form
3. Submit to create a Teams meeting for your manager

## Deployment Options

For team distribution, consider:
- **Azure Static Web Apps** - Easy deployment with built-in authentication
- **SharePoint Online** - Host as a SharePoint app
- **Internal Web Server** - Deploy to your company's web server
- **GitHub Pages** - Free hosting for public repositories

## Support

If you encounter issues:
1. Check this setup guide
2. Review the main README.md
3. Contact your IT administrator for Azure configuration help
4. Check browser console for error messages 