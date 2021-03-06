import { countryCodes, ValueObject } from 'shared/domain';
import { Guard, Result } from 'shared/core';

import { IAddress } from './types';

export class Address extends ValueObject<IAddress> {
  public static create(props: IAddress): Result<Address> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.city,
        argumentName: 'address.city',
      },
      {
        argument: props.countryCode,
        argumentName: 'address.countryCode',
      },
      {
        argument: props.houseNumber,
        argumentName: 'address.houseNumber',
      },
      {
        argument: props.postCode,
        argumentName: 'address.postCode',
      },
      {
        argument: props.province,
        argumentName: 'address.province',
      },
      {
        argument: props.street,
        argumentName: 'address.street',
      },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail(nullGuard);
    }

    const countryCodeGuard = Guard.isOneOf({
      value: props.countryCode,
      argumentName: 'address.countryCode',
      validValues: countryCodes.map(countryCode => countryCode.code),
    });

    if (!countryCodeGuard.succeeded) {
      return Result.fail(countryCodeGuard);
    }

    return Result.ok(new Address(props));
  }
}
