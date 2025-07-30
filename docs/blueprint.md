# **App Name**: Telegram Bot Manager

## Core Features:

- Bot Deployment via Docker Compose Content: Allow users to paste the content of a docker-compose.yml file into a form, provide a bot name and token, and then deploy a Telegram bot.
- Bot Management Dashboard: Provide a dashboard to view all added bots with options to start, stop, or delete them.
- Docker Status Display: Display Docker status, allowing the user to understand docker system status
- Bot Status Indicators: Show the status of each bot (active/inactive) with visual indicators.
- User Authentication: Implement user authentication with a default admin user and password, with options to change the password.
- Application Settings: Add settings to toggle automatic page refresh (every 10 seconds) and switch between light and dark mode.

## Style Guidelines:

- Primary color: #668cff, a moderate blue suggesting agility, progress, and the future of technology.
- Background color: #1a1a2e, a dark color scheme for a modern look.
- Accent color: #ff6666, an energetic saturated red to provide necessary visual contrast to primary and background colors.
- Font: 'Inter', a grotesque sans-serif with a modern, objective look; suitable for both headlines and body text
- Use clear and simple icons to represent bot actions (start, stop, delete) and status (active, inactive).
- Dashboard-style layout with status indicators and key information prominently displayed.
- Subtle transitions when changing bot states (e.g., fading in/out when starting/stopping bots).