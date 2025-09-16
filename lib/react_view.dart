import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_brownfield_app/react_view_ios.dart';

/// View that renders a React Native module.
///
/// It uses the appropriate platform-specific implementation.
class ReactView extends StatelessWidget {
  /// The name of the React Native module to be rendered.
  ///
  /// It should match the key used in AppRegistry.registerComponent() in the React Native code
  /// on the JavaScript side.
  final String moduleName;

  const ReactView(
      {super.key, required this.moduleName});

  @override
  Widget build(BuildContext context) {
    switch (defaultTargetPlatform) {
      case TargetPlatform.iOS:
        return ReactViewIos(moduleName: moduleName);
      default:
        throw UnsupportedError('Unsupported platform view');
    }
  }
}
