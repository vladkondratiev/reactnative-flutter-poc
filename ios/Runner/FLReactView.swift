import Flutter
import React
import UIKit

/**
 * Factory used by Flutter to create instances of FLReactView.
 * @see https://docs.flutter.dev/platform-integration/ios/platform-views
 */
class FLReactViewFactory: NSObject, FlutterPlatformViewFactory {
    private var messenger: FlutterBinaryMessenger

    init(messenger: FlutterBinaryMessenger) {
        self.messenger = messenger
        super.init()
    }

    func create(
        withFrame frame: CGRect,
        viewIdentifier viewId: Int64,
        arguments args: Any?
    ) -> FlutterPlatformView {
        let creationParams = args as? [String: Any]
        return FLReactView(
            frame: frame,
            viewIdentifier: viewId,
            arguments: creationParams,
            binaryMessenger: messenger)
    }

    public func createArgsCodec() -> FlutterMessageCodec & NSObjectProtocol {
          return FlutterStandardMessageCodec.sharedInstance()
    }
}

/**
 * Flutter platform view hosting React root view.
 *
 * It receives `moduleName` argument representing React component to load, it should match the
 * name of the component registered by `AppRegistry.registerComponent` in the React Native app.
 *
 * @see https://docs.flutter.dev/platform-integration/ios/platform-views
 */
class FLReactView: NSObject, FlutterPlatformView {
    private var reactRootView: RCTRootView
    private var methodChannel: FlutterMethodChannel?
    private var messenger: FlutterBinaryMessenger?

    init(
        frame: CGRect,
        viewIdentifier viewId: Int64,
        arguments args: [String: Any]?,
        binaryMessenger messenger: FlutterBinaryMessenger?
    ) {
        guard let bridge = BridgeManager.shared.bridge else {
            fatalError("BridgeManager.shared.bridge is nil. Make sure to call BridgeManager.shared.loadReactNative() before creating FLReactView.")
        }

        reactRootView = RCTRootView(
            bridge: bridge,
            moduleName: args!["moduleName"] as! String,
            initialProperties: [:]
        )
        
        super.init()
        
        // Create MethodChannel for communication with Flutter
        self.messenger = messenger
        if let messenger = messenger {
            NSLog("[FLReactView] Creating MethodChannel: flutter-brownfield/auth_code_methods")
            methodChannel = FlutterMethodChannel(
                name: "flutter-brownfield/auth_code_methods",
                binaryMessenger: messenger
            )
            NSLog("[FLReactView] MethodChannel created")
        } else {
            NSLog("[FLReactView] No messenger available for MethodChannel")
        }
        
        // Set up notification observer for auth code events
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(authCodeReceived(_:)),
            name: NSNotification.Name("AuthCodeReceived"),
            object: nil
        )
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc private func authCodeReceived(_ notification: Notification) {
        guard let authCode = notification.userInfo?["authCode"] as? String else { return }
        NSLog("[FLReactView] Notification AuthCodeReceived with: \(authCode)")
        
        let methodData: [String: Any] = [
            "authCode": authCode
        ]
        
        if let methodChannel = methodChannel {
            NSLog("[FLReactView] Invoking method 'authCodeReceived' on Flutter")
            
            // Ensure method call is sent on the main thread
            if Thread.isMainThread {
                methodChannel.invokeMethod("authCodeReceived", arguments: methodData) { result in
                    if let error = result as? FlutterError {
                        NSLog("[FLReactView] MethodChannel error: \(error)")
                    } else {
                        NSLog("[FLReactView] MethodChannel success: \(result ?? "nil")")
                    }
                }
            } else {
                DispatchQueue.main.async { [weak self] in
                    self?.methodChannel?.invokeMethod("authCodeReceived", arguments: methodData) { result in
                        if let error = result as? FlutterError {
                            NSLog("[FLReactView] MethodChannel error: \(error)")
                        } else {
                            NSLog("[FLReactView] MethodChannel success: \(result ?? "nil")")
                        }
                    }
                }
            }
        } else {
            NSLog("[FLReactView] ERROR: MethodChannel is nil!")
        }
    }

    func view() -> UIView {
        return reactRootView
    }
}

