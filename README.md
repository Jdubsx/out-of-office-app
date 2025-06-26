# Out of Office Management App

A modern web application that allows team members to submit out-of-office requests and automatically sends Microsoft Teams meeting invites to their manager.

## Features

- 🔐 Microsoft Azure AD authentication
- 📅 Easy date selection for out-of-office periods
- 📝 Reason/reasoning input
- 📧 Automatic Teams meeting creation and invitation
- 🎨 Modern, responsive UI
- 📱 Mobile-friendly design

## Prerequisites

Before running this application, you'll need:

1. **Microsoft Azure App Registration**
   - A registered application in Azure AD
   - Client ID and Tenant ID
   - Proper API permissions for Microsoft Graph

2. **Node.js and npm**
   - Node.js version 16 or higher
   - npm version 8 or higher

## Setup Instructions

### 1. Azure App Registration Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in the details:
   - **Name**: Out of Office App
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:3000`
5. After creation, note down the **Application (client) ID** and **Directory (tenant) ID**

### 2. Configure API Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Add the following permissions:
   - `User.Read`
   - `Calendars.ReadWrite`
   - `Mail.Send`
   - `User.ReadBasic.All`
6. Click "Grant admin consent"

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_CLIENT_ID=your_client_id_here
REACT_APP_TENANT_ID=your_tenant_id_here
REACT_APP_MANAGER_EMAIL=manager@yourcompany.com
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

1. **Sign In**: Users sign in with their Microsoft work account
2. **Fill Form**: Enter start date, end date, reason, and manager email
3. **Submit**: The app creates a Teams meeting and sends it to the manager
4. **Confirmation**: User receives confirmation of successful submission

## Deployment

### For Production

1. Update the redirect URI in Azure App Registration to your production URL
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the `build` folder to your web server
4. Update environment variables for production

### For Team Distribution

You can deploy this app to:
- Azure Static Web Apps
- SharePoint Online
- Any web hosting service
- Internal company servers

## Security Considerations

- All authentication is handled through Microsoft Azure AD
- No sensitive data is stored locally
- API calls use secure tokens
- HTTPS is required for production

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify client ID and tenant ID are correct
   - Ensure API permissions are granted
   - Check redirect URI configuration

2. **Teams Meeting Creation Fails**
   - Verify user has calendar permissions
   - Check manager email is valid
   - Ensure Teams is enabled for the organization

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact your IT administrator or create an issue in the repository.

## Deno Deploy Compatibility

This project can be deployed to [Deno Deploy](https://deno.com/deploy) as a static site. To do so:

1. **Build the React app:**
   ```sh
   npm run build
   ```
   This will output static files to the `build/` directory.

2. **Serve with Deno:**
   Use the provided `main.ts` Deno server script to serve the static files from the `build/` directory.

3. **Deploy to Deno Deploy:**
   - Upload the `build/` directory and `main.ts` to Deno Deploy.
   - Set up environment variables as needed in the Deno Deploy dashboard.

See `main.ts` for details on the static file server implementation. 