import { supabase, supabaseConfigured } from "./supabaseClient";

const VISITOR_KEY = "ramya_visitor_id";

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function parseUserAgent(ua) {
  const isTablet = /iPad|Tablet|PlayBook/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);
  const deviceType = isTablet ? "Tablette" : isMobile ? "Mobile" : "Ordinateur";

  let browser = "Autre";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua) || /Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Autre";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return { deviceType, browser, os };
}

export async function trackVisit(path) {
  if (!supabaseConfigured) return;
  try {
    const ua = navigator.userAgent;
    const { deviceType, browser, os } = parseUserAgent(ua);
    await supabase.from("site_visits").insert({
      visitor_id: getVisitorId(),
      path,
      referrer: document.referrer || null,
      device_type: deviceType,
      browser,
      os,
      user_agent: ua,
      screen_w: window.screen?.width || null,
      screen_h: window.screen?.height || null,
      language: navigator.language || null,
    });
  } catch (e) {
    console.warn("trackVisit:", e);
  }
}
