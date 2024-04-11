const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const nodemailer = require('nodemailer');
const { TwoCaptcha } = require('2captcha');
const solver = new TwoCaptcha('YOUR_2CAPTCHA_API_KEY');

async function createRedditAccount(email, password, proxy) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${proxy}`],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.reddit.com/register/', { waitUntil: 'networkidle0' });

    // Fill in the registration form
    await page.type('#regEmail', email);
    await page.type('#regUsername', generateUsername());
    await page.type('#regPassword', password);

    // Solve the captcha
    const captchaImage = await page.$eval('.captcha-img', (el) => el.src);
    const captchaResponse = await solver.normal(captchaImage);
    await page.type('.captcha-input', captchaResponse.data);

    // Submit the registration form
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Verify the account via email
    await verifyAccount(email, password, proxy);

    console.log(`Account created successfully: ${email}`);
    saveAccountToFile(email, password);
  } catch (error) {
    console.error(`Error creating account: ${email}`, error);
  } finally {
    await browser.close();
  }
}

async function verifyAccount(email, password, proxy) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
    proxy: `http://${proxy}`,
  });

  // Wait for the verification email and extract the verification link
  const verificationLink = await waitForVerificationEmail(transporter);

  // Open the verification link in the browser
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${proxy}`],
  });
  const page = await browser.newPage();
  await page.goto(verificationLink, { waitUntil: 'networkidle0' });
  await browser.close();
}

async function waitForVerificationEmail(transporter) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 6;
    const fetchInterval = setInterval(async () => {
      try {
        const messages = await transporter.getNewMail();
        for (const message of messages) {
          if (message.subject.includes('Verify your email address')) {
            const verificationLink = extractVerificationLink(message.text);
            clearInterval(fetchInterval);
            resolve(verificationLink);
            return;
          }
        }
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(fetchInterval);
          reject(new Error('Verification email not received within the specified attempts.'));
        }
      } catch (error) {
        console.error('Error fetching verification email:', error);
        clearInterval(fetchInterval);
        reject(error);
      }
    }, 5000);
  });
}

function extractVerificationLink(emailText) {
  // Extract the verification link from the email text using regex or string manipulation
  // Example implementation:
  const regex = /https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
  const match = emailText.match(regex);
  return match ? match[0] : null;
}

function generateUsername() {
  // Generate a random username
  // Example implementation:
  const adjectives = ['happy', 'silly', 'funny', 'crazy', 'cool'];
  const nouns = ['puppy', 'kitten', 'panda', 'unicorn', 'dragon'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

function saveAccountToFile(email, password) {
  const data = `${email}:${password}\n`;
  fs.appendFile('output.txt', data, (err) => {
    if (err) {
      console.error('Error saving account to file:', err);
    }
  });
}

async function main() {
  const emailsFile = 'emails.txt';
  const proxiesFile = 'proxies.txt';

  try {
    const emails = await readFile(emailsFile);
    const proxies = await readFile(proxiesFile);

    for (let i = 0; i < emails.length; i++) {
      const [email, password] = emails[i].split(':');
      const proxy = proxies[i % proxies.length];
      await createRedditAccount(email, password, proxy);
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

async function readFile(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
}

main().catch((error) => console.error('Error:', error));
