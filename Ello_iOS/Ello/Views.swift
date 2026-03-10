import SwiftUI

extension Color {
    static let appBackground = Color(red: 0.98, green: 0.96, blue: 0.92) // Warm, soft beige
    static let appForeground = Color(red: 0.22, green: 0.15, blue: 0.10) // Deep, comforting brown
    static let card = Color(red: 0.99, green: 0.97, blue: 0.94) // Creamy card background
    static let cardForeground = Color(red: 0.25, green: 0.18, blue: 0.12) // Deeper brown
    static let primary = Color(red: 1.00, green: 0.94, blue: 0.90) // Gentle peach
    static let primaryForeground = Color(red: 0.27, green: 0.20, blue: 0.14) // Brown
    static let secondary = Color(red: 0.93, green: 0.87, blue: 0.81) // Warm sand
    static let secondaryForeground = Color(red: 0.44, green: 0.35, blue: 0.25) // Muted brown
    static let muted = Color(red: 0.88, green: 0.81, blue: 0.73) // Lighter sand
    static let mutedForeground = Color(red: 0.68, green: 0.60, blue: 0.52) // Soft brown
    static let accent = Color(red: 0.88, green: 0.61, blue: 0.49) // Muted terracotta
    static let accentForeground = Color(red: 0.99, green: 0.97, blue: 0.94) // Creamy white
}

struct RootLayout: View {
    @EnvironmentObject var vortexManager: VortexManager
    @EnvironmentObject var xpManager: XpManager
    
    var body: some View {
        NavigationView {
            HomeScreen()
                .navigationBarHidden(true)
                .preferredColorScheme(.dark)
        }
    }
}

struct HomeScreen: View {
    @State private var selectedTab: HomeTab = .home
    @StateObject private var focusManager = FocusManager()
    
    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()
            
            VStack(spacing: 0) {
                switch selectedTab {
                case .home:
                    FrictionUI()
                case .focus:
                    FocusScreen()
                case .stats:
                    StatsScreen()
                }
                
                Spacer()
                
                BottomNavigation(selectedTab: $selectedTab)
            }
        }
        .environmentObject(focusManager)
    }
}

enum HomeTab: String, CaseIterable {
    case home = "Home"
    case focus = "Focus"
    case stats = "Stats"
}
