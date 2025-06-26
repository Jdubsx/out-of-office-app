# Minimal Out of Office App Setup Script
Write-Host "=== Out of Office App Setup ==="

# Check Node.js
Write-Host "Checking Node.js installation..."
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "Node.js is installed: $nodeVersion"
    } else {
        Write-Host "Node.js is not installed. Please install from https://nodejs.org/"
        exit 1
    }
} catch {
    Write-Host "Node.js is not installed. Please install from https://nodejs.org/"
    exit 1
}

# Check npm
Write-Host "Checking npm installation..."
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "npm is installed: $npmVersion"
    } else {
        Write-Host "npm is not installed. Please reinstall Node.js."
        exit 1
    }
} catch {
    Write-Host "npm is not installed. Please reinstall Node.js."
    exit 1
}

Write-Host "Installing npm packages..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!"
} else {
    Write-Host "Failed to install dependencies."
    exit 1
}

# .env setup
if (Test-Path ".env") {
    Write-Host ".env file already exists."
} else {
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host ".env file created from template. Please edit it with your Azure configuration."
    } else {
        Write-Host "env.example file not found. Please create a .env file manually."
    }
}

Write-Host "=== Setup Complete! ==="
Write-Host "Next steps:"
Write-Host "1. Configure your Azure App Registration (see SETUP.md)"
Write-Host "2. Update the .env file with your Azure configuration"
Write-Host "3. Run 'npm start' to start the development server"
Write-Host "For detailed setup instructions, see SETUP.md" 