#import "AuthCodeEmitter.h"
#import <React/RCTLog.h>

@implementation AuthCodeEmitter

RCT_EXPORT_MODULE()

- (void)emitAuthCode:(NSString *)authCode {
  // Emit to React Native
  [self emitOnAuthCodeReceived:@{@"authCode": authCode}];
  
  // Post notification for Flutter
  [[NSNotificationCenter defaultCenter] postNotificationName:@"AuthCodeReceived" 
                                                      object:nil 
                                                    userInfo:@{@"authCode": authCode}];
}

@end
