#import "AuthCodeEmitter.h"
#import <React/RCTLog.h>

@implementation AuthCodeEmitter

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onAuthCodeReceived"];
}

RCT_EXPORT_METHOD(emitAuthCode:(NSString *)authCode) {
  NSLog(@"[AuthCodeEmitter] emitAuthCode called with: %@", authCode);
  // Emit to React Native
  [self sendEventWithName:@"onAuthCodeReceived" body:@{@"authCode": authCode}];
  
  // Post notification for Flutter
  [[NSNotificationCenter defaultCenter] postNotificationName:@"AuthCodeReceived" 
                                                      object:nil 
                                                    userInfo:@{@"authCode": authCode}];
}

@end
