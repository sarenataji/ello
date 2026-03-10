// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Ello",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "Ello",
            targets: ["Ello"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "Ello",
            dependencies: [],
            path: "Ello"
        ),
        .testTarget(
            name: "ElloTests",
            dependencies: ["Ello"]
        ),
    ]
)