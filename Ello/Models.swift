import Foundation

struct AppToken: Identifiable, Codable {
    let id: String
    let name: String
    let category: String
    let token: String
}

struct AppInfo: Identifiable {
    let id: String
    let name: String
    let category: String
}

let APP_CATALOG: [AppInfo] = [
    AppInfo(id: "instagram", name: "Instagram", category: "Social"),
    AppInfo(id: "twitter", name: "X (Twitter)", category: "Social"),
    AppInfo(id: "tiktok", name: "TikTok", category: "Entertainment"),
    AppInfo(id: "youtube", name: "YouTube", category: "Entertainment"),
    AppInfo(id: "facebook", name: "Facebook", category: "Social"),
    AppInfo(id: "snapchat", name: "Snapchat", category: "Social"),
    AppInfo(id: "reddit", name: "Reddit", category: "News"),
    AppInfo(id: "netflix", name: "Netflix", category: "Entertainment"),
    AppInfo(id: "threads", name: "Threads", category: "Social"),
    AppInfo(id: "discord", name: "Discord", category: "Social"),
    AppInfo(id: "twitch", name: "Twitch", category: "Entertainment"),
    AppInfo(id: "pinterest", name: "Pinterest", category: "Lifestyle"),
    AppInfo(id: "linkedin", name: "LinkedIn", category: "Productivity"),
    AppInfo(id: "whatsapp", name: "WhatsApp", category: "Social"),
    AppInfo(id: "telegram", name: "Telegram", category: "Social"),
    AppInfo(id: "safari", name: "Safari", category: "Utilities"),
    AppInfo(id: "chrome", name: "Chrome", category: "Utilities"),
    AppInfo(id: "spotify", name: "Spotify", category: "Entertainment"),
]

struct DayRecord: Identifiable, Codable {
    let id: String
    let date: String
    let peakXp: Int
    let completed: Bool
    
    init(date: String, peakXp: Int, completed: Bool) {
        self.id = date
        self.date = date
        self.peakXp = peakXp
        self.completed = completed
    }
}

struct UnlockedApp: Identifiable, Codable {
    let id: String
    let expiresAt: Date
}
