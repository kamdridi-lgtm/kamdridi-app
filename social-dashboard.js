const app = document.getElementById('app');
const openUploadUrl = { youtube:'https://studio.youtube.com', instagram:'https://business.facebook.com/latest/composer', facebook:'https://business.facebook.com/latest/composer', tiktok:'https://www.tiktok.com/upload' };

const render = (campaign) => {
  const hashText = campaign.hashtags.join(' ');
  app.innerHTML = `<div class='card'><h2>${campaign.title}</h2><p><b>Artist:</b> ${campaign.artist} | <b>Single:</b> ${campaign.release_name} | <b>Album:</b> ${campaign.album_name}</p>
  <p>9x16 asset: ${campaign.asset_9x16_path}<br/>16x9 asset: ${campaign.asset_16x9_path}</p>
  <p><b>Validation</b><br/>${campaign.validations.map(v=>`${v.label}: ${v.exists ? 'OK' : 'MISSING'} (${v.truth_label})`).join('<br/>')}</p>
  <button id='copyCaption'>Copy Caption</button><button id='copyHashtags'>Copy Hashtags</button></div>
  ${campaign.platforms.map(p=>`<div class='card'><h3>${p.platform.toUpperCase()} <span class='${p.publish_status==='POSTED'?'ok':'warn'}'>${p.publish_status}</span></h3>
  <p>Auth: ${p.auth_status} | Mode: ${p.publish_mode}</p><p>${p.error_message||''}</p>
  <a href='${openUploadUrl[p.platform]}' target='_blank'><button>Open Platform Upload</button></a>
  <button data-action='probe_auth' data-platform='${p.platform}'>Check Auth</button>
  <input placeholder='Final post URL' id='url_${p.platform}' value='${p.post_url||''}'/>
  <button data-action='mark_posted' data-platform='${p.platform}'>Mark as Posted</button></div>`).join('')}`;

  document.getElementById('copyCaption').onclick = () => navigator.clipboard.writeText(campaign.caption.replace('[HYPERFOLLOW_LINK]', campaign.hyperfollow_link || 'MANUAL_REQUIRED'));
  document.getElementById('copyHashtags').onclick = () => navigator.clipboard.writeText(hashText);
  document.querySelectorAll('button[data-action]').forEach((btn)=>btn.onclick = async () => {
    const platform = btn.dataset.platform; const action = btn.dataset.action;
    const post_url = document.getElementById(`url_${platform}`).value;
    const response = await fetch('/api/social/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({campaign_id:campaign.id,platform,action,post_url})});
    if (!response.ok) alert('Action failed');
    load();
  });
};

async function load(){ const r=await fetch('/api/social/campaigns'); const data=await r.json(); render(data.campaigns[0]); }
load();
