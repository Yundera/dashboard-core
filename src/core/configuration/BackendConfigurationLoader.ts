export async function loadBackendConfiguration(url: string = "/api/core/config/core") {
  const response = await fetch(url);
  const conf = await response.json();
  (window as any).APP_CONFIG = {};
  for (const key in conf) {
    (window as any).APP_CONFIG[key] = conf[key];
  }
}