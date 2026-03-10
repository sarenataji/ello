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
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 40) {
                Spacer()
                
                Text("Breathe")
                    .font(.largeTitle)
                    .fontWeight(.light)
                    .foregroundColor(.white)
                
                FocusRing()
                
                VStack(spacing: 16) {
                    Text("Essential Tools")
                        .font(.headline)
                        .foregroundColor(.gray)
                    
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
                .font(.title3)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.white.opacity(0.2), lineWidth: 1)
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
                .stroke(Color.white.opacity(0.1), lineWidth: 20)
                .frame(width: 200, height: 200)
            
            Circle()
                .trim(from: 0, to: xpManager.getLevelProgress())
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [.blue, .purple, .pink]),
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: 20, lineCap: .round)
                )
                .frame(width: 200, height: 200)
                .rotationEffect(.degrees(-90))
            
            VStack(spacing: 8) {
                Text("Lvl \(xpManager.level)")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("\(xpManager.currentXp) XP")
                    .font(.headline)
                    .foregroundColor(.gray)
            }
        }
    }
}