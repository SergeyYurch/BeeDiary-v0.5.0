import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryTypeormRepository } from '../features/users/providers/users.query-typeorm.repository';

@ValidatorConstraint({ name: 'loginOrEmail', async: true })
@Injectable()
export class IsUniqLoginOrEmailConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    protected readonly usersQueryRepository: UsersQueryTypeormRepository,
  ) {}
  async validate(loginOrEmail: string) {
    return !(await this.usersQueryRepository.findUserByLoginOrEmail(
      loginOrEmail,
    ));
  }
}

export function IsUniqLoginOrEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqLoginOrEmailConstraint,
    });
  };
}
