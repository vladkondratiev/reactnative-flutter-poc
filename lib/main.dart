import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_brownfield_app/react_view.dart';

void main() {
  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  String? _authCode;
  late StreamSubscription<dynamic> _eventSubscription;
  static const MethodChannel _channel = MethodChannel('flutter-brownfield/auth_code_methods');

  @override
  void initState() {
    super.initState();
    // Add a small delay to ensure the iOS side is ready
    Future.delayed(const Duration(milliseconds: 100), () {
      _setupMethodChannel();
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  void _setupMethodChannel() {
    debugPrint('Setting up MethodChannel: flutter-brownfield/auth_code_methods');
    
    _channel.setMethodCallHandler((MethodCall call) async {
      debugPrint('MethodChannel received call: ${call.method} with args: ${call.arguments}');
      
      if (call.method == 'authCodeReceived') {
        final String authCode = call.arguments['authCode'] as String;
        debugPrint('AuthCode received via MethodChannel: $authCode');
        setState(() {
          _authCode = authCode;
        });
      }
    });
    
    debugPrint('MethodChannel handler set up successfully');
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: Scaffold(
        appBar: AppBar(title: Text('Nawy Shares')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_authCode != null) ...[
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    border: Border.all(color: Colors.blue.shade200),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Authorization Code Received:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade800,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: SelectableText(
                          _authCode!,
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],
              Flexible(
                flex: 1,
                child: ReactView(moduleName: 'SSOLoginScreen'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
