import SwiftUI

struct FrictionUI: View {
    @EnvironmentObject var focusManager: FocusManager
    private let essentialApps = [
        AppInfo(id: "phone", name: "Phone", category: "Essential"),
        AppInfo(id: "messages", name: "Messages", category: "Essential"),
        AppInfo(id: "maps", name: "Maps", category: "Essential"),
        AppInfo(id: "photos", name: "Photos", category: "Essential"),
        AppInfo(id: "calculator", name: "Calculator", category: "Essential"),
        AppInfo(id: "settings", name: "Settings", category: "Essential")
    ]
    
    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()
            
            VStack(spacing: 40) {
                Spacer()
                
                Text("Breathe")
                    .font(.system(size: 34, weight: .light, design: .rounded))
                    .foregroundColor(.appForeground)
                
                FocusRing()
                
                VStack(spacing: 16) {
                    Text("Essential Tools")
                        .font(.system(size: 18, weight: .medium, design: .rounded))
                        .foregroundColor(.mutedForeground)
                    
                    LazyVStack(spacing: 12) {
                        ForEach(essentialApps) { app in
                            AppButton(app: app)
                        }
                    }
                    .frame(maxWidth: 300)
                }
                
                Spacer()
            }
        }
    }
}

struct AppButton: View {
    let app: AppInfo
    @State private var isPressed = false
    
    var body: some View {
        Button(action: {
            isPressed = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                isPressed = false
            }
        }) {
            Text(app.name)
                .font(.system(size: 20, weight: .medium, design: .rounded))
                .foregroundColor(.appForeground)
                .frame(maxWidth: .infinity)
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.accent.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.muted.opacity(0.2), lineWidth: 1)
                        )
                )
                .scaleEffect(isPressed ? 0.95 : 1.0)
                .animation(.spring(response: 0.3), value: isPressed)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct FocusRing: View {
    @EnvironmentObject var xpManager: XpManager
    
    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.muted.opacity(0.2), lineWidth: 20)
                .frame(width: 200, height: 200)
            
            Circle()
                .trim(from: 0, to: xpManager.getLevelProgress())
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [.primary, .muted, .accent]),
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: 20, lineCap: .round)
                )
                .frame(width: 200, height: 200)
                .rotationEffect(.degrees(-90))
            
            VStack(spacing: 8) {
                Text("Lvl \(xpManager.level)")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.appForeground)
                
                Text("\(xpManager.currentXp) XP")
                    .font(.system(size: 16, weight: .medium, design: .rounded))
                    .foregroundColor(.mutedForeground)
            }
        }
    }
}