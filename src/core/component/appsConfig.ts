export interface AppConfig {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
}

const ICON_BASE = "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps";

export const appsConfig: AppConfig[] = [
  {
    id: "immich",
    icon: `${ICON_BASE}/Immich/icon.png`,
    name: "Immich",
    subtitle: "Your Private Photo Library, Fully Under Your Control",
    description: "Automatically back up your photos and videos from your phone. Organize them by date, location, or face.",
    category: "Gallery"
  },
  {
    id: "vaultwarden",
    icon: `${ICON_BASE}/Vaultwarden/icon.png`,
    name: "Vaultwarden",
    subtitle: "Secure, self-hosted password manager",
    description: "A secure password manager that helps you store, organize, and access your passwords easily across all your devices.",
    category: "Utilities"
  },
  {
    id: "nextcloud",
    icon: `${ICON_BASE}/Nextcloud/icon.png`,
    name: "Nextcloud",
    subtitle: "Build your Teams alternative with guided app installation",
    description: "Your own personal cloud: like Google Drive, Dropbox, Microsoft Teams, and WhatsApp all-in-one, but fully under your control.",
    category: "Utilities"
  },
  {
    id: "filebrowser",
    icon: `${ICON_BASE}/FileBrowser/icon.png`,
    name: "FileBrowser",
    subtitle: "This is your Cloud",
    description: "Your own Drive alternative - upload, organize, and share files with full control and privacy.",
    category: "Cloud"
  },
  {
    id: "duplicati",
    icon: `${ICON_BASE}/Duplicati/icon.png`,
    name: "Duplicati",
    subtitle: "Your Backup App",
    description: "Encrypt and back up your data to the cloud, safely and automatically with incremental, compressed backups.",
    category: "Cloud"
  },
  {
    id: "jellyfin",
    icon: `${ICON_BASE}/Jellyfin/icon.png`,
    name: "Jellyfin",
    subtitle: "This is your Movie Hub",
    description: "Watch your own movies, shows, and live TV - just like a streaming app, but fully hosted by you.",
    category: "Media"
  },
  {
    id: "mealie",
    icon: `${ICON_BASE}/Mealie/icon.png`,
    name: "Mealie",
    subtitle: "Your family recipes, organized and accessible forever",
    description: "Save any recipe from any website directly to your personal collection. Plan meals and generate shopping lists automatically.",
    category: "Utilities"
  },
  {
    id: "claude",
    icon: `${ICON_BASE}/ClaudeCode/icon.png`,
    name: "Claude Code",
    subtitle: "Web terminal for Claude Code",
    description: "Anthropic's AI coding assistant with web-based terminal access, persistent workspace, and full administrative power.",
    category: "Developer"
  },
  {
    id: "stirlingpdf",
    icon: `${ICON_BASE}/Stirling-PDF/icon.png`,
    name: "Stirling PDF",
    subtitle: "Your complete PDF toolkit in your browser",
    description: "Split, merge, convert, compress, and edit PDF files right from your web browser. All processing happens on your server.",
    category: "Office"
  },
  {
    id: "convertx",
    icon: `${ICON_BASE}/ConvertX/icon.png`,
    name: "ConvertX",
    subtitle: "Universal file converter supporting 1000+ formats",
    description: "A self-hosted universal file converter accommodating over 1000 different file formats.",
    category: "Utilities"
  },
  {
    id: "dufs",
    icon: `${ICON_BASE}/Dufs/icon.png`,
    name: "Dufs",
    subtitle: "Modern file server with WebDAV support",
    description: "A modern, lightweight file server that combines a beautiful web interface with powerful WebDAV capabilities.",
    category: "Cloud"
  },
  {
    id: "Spliit",
    icon: `${ICON_BASE}/Spliit/icon.png`,
    name: "Spliit",
    subtitle: "Free and Open Source Expense Sharing App",
    description: "Split expenses with friends without signup required. Create groups, add participants, and view optimized settlements instantly.",
    category: "Finance"
  },
  {
    id: "odoo",
    icon: `${ICON_BASE}/Odoo/icon.png`,
    name: "Odoo",
    subtitle: "Open Source ERP and CRM",
    description: "A suite of open source business apps covering CRM, eCommerce, accounting, inventory, POS, and project management.",
    category: "Business"
  },
  {
    id: "guacamole",
    icon: `${ICON_BASE}/Guacamole/icon.png`,
    name: "Guacamole",
    subtitle: "Open-source remote desktop gateway",
    description: "A clientless remote desktop gateway supporting standard protocols including VNC, RDP, and SSH.",
    category: "Productivity"
  },
  {
    id: "psitransfer",
    icon: `${ICON_BASE}/PsiTransfer/icon.png`,
    name: "PsiTransfer",
    subtitle: "Simple, lightweight file sharing",
    description: "A simple, open-source, self-hosted file sharing solution. Your own WeTransfer alternative.",
    category: "Utilities"
  },
  {
    id: "segmentplayer",
    icon: `${ICON_BASE}/SegmentPlayer/icon.png`,
    name: "SegmentPlayer",
    subtitle: "Stream any video file as HLS on-the-fly",
    description: "A media streaming application that serves video files as HLS streams without requiring advance processing.",
    category: "Media"
  },
  {
    id: "ssa",
    icon: `${ICON_BASE}/SegmentStremioAddon/icon.png`,
    name: "Segment Stremio Addon",
    subtitle: "Browse and stream your local media via SegmentPlayer",
    description: "Stremio Addon for SegmentPlayer - Browse and stream your local media library directly in Stremio.",
    category: "Media"
  },
  {
    id: "tincatan",
    icon: `${ICON_BASE}/TINCatan/icon.png`,
    name: "TINC - Settlers of Catan",
    subtitle: "Web-based Settlers of Catan game",
    description: "A full-featured web implementation of Settlers of Catan with advanced features.",
    category: "Games"
  },
  {
    id: "qbittorrent",
    icon: `${ICON_BASE}/qBittorrent/icon.png`,
    name: "qBittorrent",
    subtitle: "Powerful BitTorrent client",
    description: "A cross-platform free and open-source BitTorrent client with sequential downloading, bandwidth scheduling, and RSS feed support.",
    category: "Downloader"
  },
  {
    id: "caddy",
    icon: `${ICON_BASE}/Caddy/icon.png`,
    name: "Caddy",
    subtitle: "Secure static website hosting with automatic HTTPS",
    description: "A powerful, enterprise-ready web server with automatic HTTPS.",
    category: "WEB"
  },
  {
    id: "nginx",
    icon: `${ICON_BASE}/Nginx/icon.png`,
    name: "Nginx",
    subtitle: "Lightning-fast static website hosting",
    description: "A lightweight, high-performance web server for hosting static websites, HTML pages, and JavaScript applications.",
    category: "WEB"
  },
  {
    id: "samba",
    icon: `${ICON_BASE}/Samba/icon.png`,
    name: "Samba",
    subtitle: "Universal network file sharing for all devices",
    description: "Native SMB/CIFS protocol support for universal file sharing with Windows, macOS, and Linux systems.",
    category: "Cloud"
  },
  {
    id: "netdata",
    icon: `${ICON_BASE}/Netdata/icon.png`,
    name: "Netdata",
    subtitle: "Real-time system performance monitoring",
    description: "Real-time performance and health monitoring for systems, containers, and applications with beautiful dashboards.",
    category: "Utilities"
  },
  {
    id: "tailscale",
    icon: `${ICON_BASE}/Tailscale/icon.png`,
    name: "Tailscale",
    subtitle: "Zero-config mesh VPN for secure device connections",
    description: "A secure mesh VPN that creates encrypted connections between your devices.",
    category: "Network"
  },
  {
    id: "terminal",
    icon: `${ICON_BASE}/Terminal/icon.png`,
    name: "Terminal",
    subtitle: "Secure hash-locked terminal access",
    description: "A web-based terminal featuring hash-based authentication via nginxhashlock technology.",
    category: "Utilities"
  },
  {
    id: "openclaw",
    icon: `${ICON_BASE}/OpenClaw/icon.png`,
    name: "OpenClaw",
    subtitle: "Open-source AI assistant that actually does things",
    description: "An open-source personal AI assistant capable of performing genuine tasks, not just responding to queries.",
    category: "AI"
  }
];
