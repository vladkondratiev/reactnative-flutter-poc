#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface AuthCodeEmitter : RCTEventEmitter <RCTBridgeModule>

- (void)emitAuthCode:(NSString *)authCode;

@end

NS_ASSUME_NONNULL_END
