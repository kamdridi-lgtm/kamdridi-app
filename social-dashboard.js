const app = document.getElementById('app');
const openUploadUrl = {
  youtube: 'https://studio.youtube.com',
  instagram: 'https://business.facebook.com/latest/composer',
  facebook: 'https://business.facebook.com/latest/composer',
  tiktok: 'https://www.tiktok.com/upload'
};

const truthColor = {
  REAL: '#8be28b',
  PRESENT_UNTESTED: '#9ed0ff',
  NEEDS_TOKEN: '#ffb86b',
  NEEDS_REVIEW: '#ff8a8a',
  MANUAL_REQUIRED: '#ffd479',
  POSTED: '#75f0b8',
  FAILED: '#ff6b6b'
};

const copy = async (value, label) => {
  await navigator.clipboard.writeText(value);
  alert(`${label} copied`);
};

const render = (campaign) => {
  const hashText = campaign.hashtags.join(' ');

  app.innerHTML = `<div class='card'><h2>${campaign.title}</h2>
  <p><b>Artist:</b> ${campaign.artist} | <b>Single:</b> ${campaign.release_name} | <b>Album:</b> ${campaign.album_name}</p>
  <p>9x16 asset: ${campaign.asset_9x16_path}<br/>16x9 asset: ${campaign.asset_16x9_path}</p>
  <p><b>Validation</b><br/>${campaign.validations.map((item) => `${item.label}: ${item.exists ? 'OK' : 'MISSING'} (${item.truth_label})`).join('<br/>')}</p>
  <button id='copyCaption'>Copy Caption</button><button id='copyHashtags'>Copy Hashtags</button></div>

  ${campaign.platforms.map((platform) => `<div class='card'>
    <h3>${platform.platform.toUpperCase()} <span style='color:${truthColor[platform.truth_label || platform.publish_status] || '#eee'}'>${platform.publish_status}</span></h3>
    <p>Auth: ${platform.auth_status} | Mode: ${platform.publish_mode} | Truth: ${platform.truth_label || 'PRESENT_UNTESTED'}</p>
    <p>${platform.error_message || ''}</p>
    <a href='${openUploadUrl[platform.platform]}' target='_blank' rel='noreferrer'><button>Open Platform Upload</button></a>
    <button data-action='probe_auth' data-platform='${platform.platform}'>Check Auth</button>
    <input placeholder='Final post URL' id='url_${platform.platform}' value='${platform.post_url || ''}'/>
    <button data-action='mark_posted' data-platform='${platform.platform}'>Mark as Posted</button>
  </div>`).join('')}`;

  document.getElementById('copyCaption').onclick = () => copy(campaign.caption.replace('[HYPERFOLLOW_LINK]', campaign.hyperfollow_link || 'MANUAL_REQUIRED'), 'Caption');
  document.getElementById('copyHashtags').onclick = () => copy(hashText, 'Hashtags');

  document.querySelectorAll('button[data-action]').forEach((button) => {
    button.onclick = async () => {
      const platform = button.dataset.platform;
      const action = button.dataset.action;
      const post_url = document.getElementById(`url_${platform}`).value;
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_id: campaign.id, platform, action, post_url })
      });

      if (!response.ok) {
        const payload = await response.json();
        alert(payload.error || 'Action failed');
      }

      load();
    };
  });
};

async function load() {
  const response = await fetch('/api/social/campaigns');
  const payload = await response.json();
  render(payload.campaigns[0]);
}

load();
