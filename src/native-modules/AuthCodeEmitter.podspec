require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "AuthCodeEmitter"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/example/auth-code-emitter"
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-auth-code-emitter.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  
  s.dependency "React-Core"
  s.dependency "React"
  s.dependency "RCT-Folly"

  install_modules_dependencies(s)
end
