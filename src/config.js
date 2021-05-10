/* const UNLEASH_API_KEY = process.env.UNLEASH_API_KEY;
const UNLEASH_API_URL = process.env.UNLEASH_API_URL;

const errors = [];

if (!UNLEASH_API_URL) {
  errors.push('UNLEASH_API_URL must be set');
}

if (!UNLEASH_API_KEY) {
  errors.push('UNLEASH_API_KEY must be set to a valid Unleash API token')
}

if (errors.length > 0) {
  console.error(
    `${errors.length} environment variables are missing or misconfigured:` + 
    `${errors.join('\n ')}` +
    `Please see README.md for further details.`
  );
  throw new Error(`Environment variable config error ${errors.join('\n')}`);
} */

export const unleashUrl = 'https://app.unleash-hosted.com/demo'; //UNLEASH_API_URL;
export const unleashApiKey = 'DEFINE_ME';