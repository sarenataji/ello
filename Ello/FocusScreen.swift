import SwiftUI

struct FocusScreen: View {
    @EnvironmentObject var focusManager: FocusManager
    @EnvironmentObject var xpManager: XpManager
    @State private var showTip = false
    @State private var currentTip = ""
    
    private let quickTips = [
        "Take 3 deep breaths",
        "Drink a glass of water",
        "Stretch for 30 seconds",
        "Look away from your screen",
        "Think of one thing you're grateful for",
        "Stand up and walk around",
        "Close your eyes for a moment"
    ]
    
    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()
            
            VStack(spacing: 40) {
                Spacer()
                
                if !focusManager.isActive {
                    StartFocusButton()
                } else {
                    ActiveFocusSession()
                }
                
                Text("Blocked Apps")
                    .font(.headline)
                    .foregroundColor(.gray)
                
                BlockedAppsList()
                
                Spacer()
            }
        }
        .sheet(isPresented: $showTip) {
            ShieldScreen(tip: currentTip) {
                showTip = false
                xpManager.penalizeXP()
            }
        }
    }
}

struct StartFocusButton: View {
    @EnvironmentObject var focusManager: FocusManager
    
    var body: some View {
        Button(action: {
            focusManager.startFocusSession()
        }) {
            VStack(spacing: 12) {
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.green)
                
                Text("BEGIN FOCUS")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.green.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.green.opacity(0.3), lineWidth: 2)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ActiveFocusSession: View {
    @EnvironmentObject var focusManager: FocusManager
    @State private var timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    @State private var elapsedSeconds = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("FOCUS ACTIVE")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.green)
            
            ZStack {
                Circle()
                    .stroke(Color.green.opacity(0.2), lineWidth: 8)
                    .frame(width: 150, height: 150)
                
                Circle()
                    .trim(from: 0, to: 0.7)
                    .stroke(Color.green, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .frame(width: 150, height: 150)
                    .rotationEffect(.degrees(-90))
                
                Text(formatTime(elapsedSeconds))
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            .onReceive(timer) { _ in
                elapsedSeconds += 1
            }
            
            Button(action: {
                let _ = elapsedSeconds / 3600
                // Will be handled by environment object
                focusManager.endFocusSession()
            }) {
                Text("END SESSION")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.red.opacity(0.2))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.red.opacity(0.5), lineWidth: 1)
                            )
                    )
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    private func formatTime(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let remainingSeconds = seconds % 60
        return String(format: "%02d:%02d", minutes, remainingSeconds)
    }
}

struct BlockedAppsList: View {
    @EnvironmentObject var focusManager: FocusManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                ForEach(APP_CATALOG.prefix(8)) { app in
                    BlockedAppRow(app: app, isBlocked: focusManager.blockedApps.contains(app.id)) {
                        focusManager.toggleAppBlocking(for: app.id)
                    }
                }
            }
            .padding()
        }
        .frame(maxHeight: 300)
    }
}

struct BlockedAppRow: View {
    let app: AppInfo
    let isBlocked: Bool
    let onToggle: () -> Void
    
    var body: some View {
        HStack {
            Text(app.name)
                .font(.title3)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Toggle("", isOn: Binding(
                get: { isBlocked },
                set: { _ in onToggle() }
            ))
            .labelsHidden()
            .tint(.green)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(isBlocked ? Color.green.opacity(0.1) : Color.white.opacity(0.05))
        )
    }
}

struct ShieldScreen: View {
    let tip: String
    let onContinue: () -> Void
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 30) {
                Spacer()
                
                Image(systemName: "shield.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.orange)
                
                Text("FOCUS SHIELD ACTIVE")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text(tip)
                    .font(.title2)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding()
                
                Button(action: onContinue) {
                    Text("I understand")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white.opacity(0.1))
                        )
                }
                .buttonStyle(PlainButtonStyle())
                
                Spacer()
            }
            .padding()
        }
    }
}