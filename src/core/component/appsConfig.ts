export interface AppConfig {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  description: string;
}

export const appsConfig: AppConfig[] = [
  {
    id: "nextcloud",
    icon: "https://raw.githubusercontent.com/nextcloud/server/master/core/img/favicon.png",
    name: "Nextcloud",
    subtitle: "File Storage & Collaboration",
    description: "Secure file hosting and collaboration platform."
  },
  {
    id: "plex",
    icon: "https://www.plex.tv/wp-content/uploads/2018/01/plex-logo-dark.png",
    name: "Plex",
    subtitle: "Media Server",
    description: "Stream movies, TV shows, music and photos to any device, anywhere."
  },
  {
    id: "homeassistant",
    icon: "https://www.home-assistant.io/images/favicon-192x192-full.png",
    name: "Home Assistant",
    subtitle: "Smart Home Hub",
    description: "Control and automate smart home devices from one central location."
  },
  {
    id: "bitwarden",
    icon: "https://bitwarden.com/icons/icon-96x96.png",
    name: "Bitwarden",
    subtitle: "Password Manager",
    description: "Secure password management and digital vault for sensitive data."
  },
  {
    id: "jellyfin",
    icon: "https://jellyfin.org/images/favicon.ico",
    name: "Jellyfin",
    subtitle: "Media System",
    description: "Free media server for organizing and streaming your content."
  },
  {
    id: "gitea",
    icon: "https://gitea.io/images/favicon.png",
    name: "Gitea",
    subtitle: "Git Repository",
    description: "Lightweight Git service for hosting code repositories and collaboration."
  }
];