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

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: ListScreen(),
    );
  }
}

class ListItem {
  // Title to display in the list.
  final String title;

  // React component name to render.
  final String moduleName;

  // Is this a screen flow, which contains it's own screen navigation using React Navigation.
  final bool? isFlow;

  ListItem({required this.title, required this.moduleName, this.isFlow});
}

class ListScreen extends StatelessWidget {
  final platform = const MethodChannel('flutter-brownfield/native');
  final items = [
    ListItem(
      title: 'Smartcrowd (React Native)',
      moduleName: 'ReactNavigationFlow',
    ),
  ];

  ListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nawy (Flutter)'),
      ),
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(items[index].title),
            onTap: () async {
              ListItem item = items[index];
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => DetailsScreen(item: item)),
              );
            },
          );
        },
      ),
    );
  }
}

class DetailsScreen extends StatelessWidget {
  final ListItem item;

  const DetailsScreen({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(item.title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              flex: 1,
              child: ReactView(moduleName: item.moduleName),
            ),
          ],
        ),
      ),
    );
  }
}
