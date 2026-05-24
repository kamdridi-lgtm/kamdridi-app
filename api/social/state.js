const fs = require('fs/promises');
const path = require('path');

const STATE_DIR = path.join(process.cwd(), 'state');

const files = {
  campaigns: 'social_campaigns.json',
  platforms: 'social_platforms.json',
  posts: 'social_posts.json',
  errors: 'social_errors.json'
};

const readJson = async (name) => JSON.parse(await fs.readFile(path.join(STATE_DIR, files[name]), 'utf8'));
const writeJson = async (name, value) => fs.writeFile(path.join(STATE_DIR, files[name]), JSON.stringify(value, null, 2));

module.exports = { readJson, writeJson };
