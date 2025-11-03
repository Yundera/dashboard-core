export interface AppConfig {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  description: string;
}

export const appsConfig: AppConfig[] = [
  {
    id: "immich",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Immich/icon.png",
    name: "Immich",
    subtitle: "Photo & Video Library",
    description: "Your private photo library, fully under your control. Backup from mobile devices and organize by date, location, and face."
  },
  {
    id: "vaultwarden",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Vaultwarden/icon.png",
    name: "Vaultwarden",
    subtitle: "Password Manager",
    description: "Self-hosted password management with end-to-end encryption. Store login credentials, credit cards, and 2FA codes securely."
  },
  {
    id: "nextcloud",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Nextcloud/icon.png",
    name: "Nextcloud",
    subtitle: "Collaboration Platform",
    description: "Build your Teams alternative with file storage, calendar, contacts, video calling, and office suite capabilities."
  },
  {
    id: "filebrowser",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/FileBrowser/icon.png",
    name: "FileBrowser",
    subtitle: "File Management",
    description: "Full-featured file management in your browser. Upload, organize, preview, and share files across all your devices."
  },
  {
    id: "duplicati",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Duplicati/icon.png",
    name: "Duplicati",
    subtitle: "Backup Solution",
    description: "Encrypt and back up your data to the cloud safely and automatically with incremental, compressed backups."
  },
  {
    id: "jellyfin",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Jellyfin/icon.png",
    name: "Jellyfin",
    subtitle: "Media Server",
    description: "Your movie hub. Watch your own movies, shows, and live TV just like a streaming app, but fully hosted by you."
  },
  {
    id: "mealie",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Mealie/icon.png",
    name: "Mealie",
    subtitle: "Recipe Manager",
    description: "Your family cookbook that never loses recipes. Save recipes from any website, plan meals, and generate shopping lists automatically."
  },
  {
    id: "navidrome",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Navidrome/icon.png",
    name: "Navidrome",
    subtitle: "Music Streaming",
    description: "Stream your personal music collection from anywhere. Compatible with Subsonic apps for iOS and Android with multi-user support."
  },
  {
    id: "rocketchat",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/RocketChat/icon.png",
    name: "RocketChat",
    subtitle: "Team Communication",
    description: "Complete team communication platform with secure messaging, file sharing, voice/video calls, and customizable integrations."
  },
  {
    id: "seafile",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Seafile/icon.png",
    name: "Seafile",
    subtitle: "File Hosting & Collaboration",
    description: "Enterprise-grade file sync and sharing with team libraries, version control, online editing, and two-factor authentication."
  },
  {
    id: "suwayomi",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/Suwayomi/icon.png",
    name: "Suwayomi",
    subtitle: "Manga Library",
    description: "Your personal manga library with 1200+ sources. Track reading progress, download for offline reading, and sync across devices."
  },
  {
    id: "qbittorrent",
    icon: "https://cdn.jsdelivr.net/gh/Yundera/AppStore@main/Apps/qBittorrent/icon.png",
    name: "qBittorrent",
    subtitle: "BitTorrent Client",
    description: "Feature-rich BitTorrent client with sequential downloading, bandwidth scheduling, RSS feed support, and web-based interface."
  }
];