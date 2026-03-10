import SwiftUI

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
        .environmentObject(focusManager)
    }
}

enum HomeTab: String, CaseIterable {
    case home = "Home"
    case focus = "Focus"
    case stats = "Stats"
}