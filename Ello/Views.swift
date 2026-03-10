import SwiftUI

extension Color {
    static let appBackground = Color(red: 0.145, green: 0.145, blue: 0.145)
    static let appForeground = Color(red: 0.985, green: 0.985, blue: 0.985)
    static let card = Color(red: 0.145, green: 0.145, blue: 0.145)
    static let cardForeground = Color(red: 0.985, green: 0.985, blue: 0.985)
    static let primary = Color(red: 0.985, green: 0.985, blue: 0.985)
    static let primaryForeground = Color(red: 0.205, green: 0.205, blue: 0.205)
    static let secondary = Color(red: 0.269, green: 0.269, blue: 0.269)
    static let secondaryForeground = Color(red: 0.985, green: 0.985, blue: 0.985)
    static let muted = Color(red: 0.269, green: 0.269, blue: 0.269)
    static let mutedForeground = Color(red: 0.708, green: 0.708, blue: 0.708)
    static let accent = Color(red: 0.269, green: 0.269, blue: 0.269)
    static let accentForeground = Color(red: 0.985, green: 0.985, blue: 0.985)
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