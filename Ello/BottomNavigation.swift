import SwiftUI

struct BottomNavigation: View {
    @Binding var selectedTab: HomeTab
    
    var body: some View {
        HStack(spacing: 20) {
            ForEach(HomeTab.allCases, id: \.self) { tab in
                NavigationButton(
                    tab: tab,
                    isSelected: selectedTab == tab,
                    action: { selectedTab = tab }
                )
            }
        }
        .padding(.horizontal, 40)
        .padding(.vertical, 20)
        .background(
            RoundedRectangle(cornerRadius: 25)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 25)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
        .padding(.horizontal)
    }
}

struct NavigationButton: View {
    let tab: HomeTab
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: iconName(for: tab))
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : .gray)
                
                Text(tab.rawValue)
                    .font(.caption)
                    .foregroundColor(isSelected ? .white : .gray)
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private func iconName(for tab: HomeTab) -> String {
        switch tab {
        case .home:
            return "house.fill"
        case .focus:
            return "target"
        case .stats:
            return "chart.bar.fill"
        }
    }
}