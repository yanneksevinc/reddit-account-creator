# Reddit Account Creator Bot

This is an automated bot that creates Reddit accounts using provided email:password combinations and proxies. The bot utilizes Puppeteer for browser automation, 2captcha API for captcha solving, and Nodemailer for email verification.

## Features

- Automated creation of Reddit accounts
- Proxy support for anonymous account creation
- Captcha solving using the 2captcha API
- Email verification using Nodemailer
- Simulation of human behavior using Puppeteer

## Prerequisites

- Node.js
- npm
- 2captcha API key
- Outlook.com Accounts with IMAP/SMTP enabled

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yanneksevinc/reddit-account-creator.git
   ```

2. Navigate to the project directory:
   ```
   cd reddit-account-creator
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up the input files:
   - Create a file named `emails.txt` in the project directory and add the email:password combinations, one per line, in the format `email:password`.
     They must be Outlook Accounts with IMAP/SMTP enabled. You can get such accounts from accsmarket.com or buyaccs.com
   - Create a file named `proxies.txt` in the project directory and add the proxy server addresses, one per line.

5. Replace `'YOUR_2CAPTCHA_API_KEY'` in the code with your actual 2captcha API key.

## Usage

To start the Reddit account creator bot, run the following command:
```
node reddit-account-creator.js
```

The bot will begin creating Reddit accounts using the provided email:password combinations and proxies. It will log successful account creations and any errors encountered during the process.

## Disclaimer

Please note that this bot is intended for educational purposes only. Creating automated accounts may violate the terms of service of the target website. Use this bot responsibly and at your own risk. The authors of this project are not responsible for any misuse or consequences arising from the use of this bot.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Contact

For any questions or inquiries, please contact me on my email yannek(at)yanneksevinc.de

