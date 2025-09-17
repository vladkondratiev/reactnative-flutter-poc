#import <Foundation/Foundation.h>
#import <AuthCodeEmitterSpec/AuthCodeEmitterSpec.h>

NS_ASSUME_NONNULL_BEGIN

@interface AuthCodeEmitter : AuthCodeEmitterSpecBase <AuthCodeEmitterSpec>

- (void)emitAuthCode:(NSString *)authCode;

@end

NS_ASSUME_NONNULL_END
