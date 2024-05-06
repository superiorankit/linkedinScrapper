# LinkedIn Scraper Node.js Application

This Node.js application allows you to scrape data from LinkedIn and store it in an XML file. This guide will walk you through the steps to clone and run the application.

## Prerequisites

- Node.js installed on your machine
- LinkedIn account credentials (username and password)
- Git installed on your machine

## Steps

### 1. Clone the Repository

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/superiorankit/linkedinScrapper.git
cd linkedinScrapper
npm install
```

### 2. Set Environment Variables

Create a config.env file in the root directory of your project and add your LinkedIn username and password:

LINKEDIN_USERNAME=your_username<br/>
LINKEDIN_PASSWORD=your_password

Replace your_username and your_password with your LinkedIn credentials.

### 3. Run the Application

Once you have set up the environment variables, you can run the application using the following command:

```bash
npm start
```

## Notes

- This application is for educational purposes only. Do not use it for any malicious activities or violate LinkedIn's terms of service.
- Ensure that you have permission to scrape data from LinkedIn and respect the privacy of other users.
- LinkedIn's terms of service may change over time, so make sure to review them regularly to ensure compliance.