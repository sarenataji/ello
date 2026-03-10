import SwiftUI

struct StatsScreen: View {
    @EnvironmentObject var xpManager: XpManager
    @State private var selectedPeriod: StatsPeriod = .week
    
    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()
            
            VStack(spacing: 30) {
                Spacer()
                
                Text("Your Progress")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.appForeground)
                
                LevelProgressCard()
                
                StatsSegmentedControl(selectedPeriod: $selectedPeriod)
                
                StatsGrid()
                
                Spacer()
            }
        }
    }
}

enum StatsPeriod: String, CaseIterable {
    case day = "Day"
    case week = "Week"
    case month = "Month"
}

struct LevelProgressCard: View {
    @EnvironmentObject var xpManager: XpManager
    
    var body: some View {
        VStack(spacing: 20) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Current Level")
                        .font(.headline)
                        .foregroundColor(.gray)
                    
                    Text("\(xpManager.level)")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(.white)
                }
                
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text("Total XP")
                        .font(.headline)
                        .foregroundColor(.gray)
                    
                    Text("\(xpManager.currentXp)")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.blue)
                }
            }
            
            ProgressView(value: xpManager.getLevelProgress())
                .tint(.blue)
            
            HStack {
                Text("Next Level")
                    .font(.caption)
                    .foregroundColor(.gray)
                
                Spacer()
                
                Text("\(Int(xpManager.getLevelProgress() * 100))%")
                    .font(.caption)
                    .foregroundColor(.white)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
    }
}

struct StatsSegmentedControl: View {
    @Binding var selectedPeriod: StatsPeriod
    
    var body: some View {
        Picker("Period", selection: $selectedPeriod) {
            ForEach(StatsPeriod.allCases, id: \.self) { period in
                Text(period.rawValue)
                    .tag(period)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
        .background(Color.white.opacity(0.1))
    }
}

struct StatsGrid: View {
    @EnvironmentObject var xpManager: XpManager
    
    var body: some View {
        VStack(spacing: 16) {
            StatsRow(
                title: "Focus Streak",
                value: "\(xpManager.currentStreak) days",
                icon: "flame.fill",
                color: .orange
            )
            
            StatsRow(
                title: "Total Sessions",
                value: "12",
                icon: "clock.fill",
                color: .blue
            )
            
            StatsRow(
                title: "Peak Focus Time",
                value: "4h 30m",
                icon: "bolt.fill",
                color: .yellow
            )
            
            StatsRow(
                title: "Apps Blocked",
                value: "47",
                icon: "hand.raised.fill",
                color: .red
            )
        }
    }
}

struct StatsRow: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 40)
            
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.white)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
        )
    }
}