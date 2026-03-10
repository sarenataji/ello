import SwiftUI

@main
struct ElloApp: App {
    @StateObject private var vortexManager = VortexManager()
    @StateObject private var xpManager = XpManager()
    
    var body: some Scene {
        WindowGroup {
            RootLayout()
                .environmentObject(vortexManager)
                .environmentObject(xpManager)
        }
    }
}
