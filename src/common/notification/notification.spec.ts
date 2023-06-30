import { NotificationResult } from './notificationResult';
import { NotificationCodesEnum } from './notification-codes.enum';

describe('Notification', () => {
  let notification: NotificationResult;

  beforeEach(() => {
    notification = new NotificationResult();
  });

  it('should have code set to OK by default', () => {
    expect(notification.code).toEqual(NotificationCodesEnum.OK);
  });

  it('should not have an error initially', () => {
    expect(notification.hasError()).toBe(false);
  });

  it('should add error and update the code', () => {
    notification.addError('An error occurred', 'key', 123);
    expect(notification.code).toEqual(NotificationCodesEnum.ERROR);
  });

  it('should have an error after adding error', () => {
    notification.addError('An error occurred', 'key', 123);
    expect(notification.hasError()).toBe(true);
  });
});
