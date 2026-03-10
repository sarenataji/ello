import Foundation
import FamilyControls

class FocusManager: ObservableObject {
    @Published var isActive = false
    @Published var focusStartTime: Date?
    @Published var blockedApps: Set<String> = []
    
    private let authorizationCenter = AuthorizationCenter.shared
    
    func requestAuthorization() async throws {
        try await authorizationCenter.requestAuthorization(for: .individual)
    }
    
    func startFocusSession() {
        isActive = true
        focusStartTime = Date()
    }
    
    func endFocusSession() {
        isActive = false
        focusStartTime = nil
    }
    
    func toggleAppBlocking(for appId: String) {
        if blockedApps.contains(appId) {
            blockedApps.remove(appId)
        } else {
            blockedApps.insert(appId)
        }
    }
}

class XpManager: ObservableObject {
    @Published var currentXp: Int = 0
    @Published var currentStreak: Int = 0
    @Published var level: Int = 1
    @Published var dailyRecords: [DayRecord] = []
    
    private let xpPerHour = 10
    private let xpPenalty = 20
    private let xpForLevelUp = 100
    
    func addFocusXP(for hours: Int) {
        let earnedXp = hours * xpPerHour
        currentXp += earnedXp
        checkLevelUp()
        saveProgress()
    }
    
    func penalizeXP() {
        currentXp = max(0, currentXp - xpPenalty)
        currentStreak = 0
        saveProgress()
    }
    
    private func checkLevelUp() {
        let newLevel = (currentXp / xpForLevelUp) + 1
        if newLevel > level {
            level = newLevel
        }
    }
    
    func getLevelProgress() -> Double {
        let progress = Double(currentXp % xpForLevelUp) / Double(xpForLevelUp)
        return progress
    }
    
    private func saveProgress() {
        
    }
}

class VortexManager: ObservableObject {
    @Published var intensity: Double = 0.5
    @Published var isActive: Bool = false
    
    func toggleVortex() {
        isActive.toggle()
    }
    
    func setIntensity(_ value: Double) {
        intensity = value
    }
}