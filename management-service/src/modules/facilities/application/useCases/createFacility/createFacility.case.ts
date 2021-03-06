import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { AppError, Either, left, Result, right, UseCase } from 'shared/core';

import { CreateFacilityDto } from './createFacility.dto';
import { Facility, Slug } from '../../../domain';
import { FacilityRepository } from '../../../adapter';
import { FacilityFactory } from '../../factories';
import { FacilityAddedEvent } from '../../../../enterprise/application/events';
import { CreateFacilityErrors } from './createFacility.errors';

export type CreateFacilityResponse = Either<
  AppError.ValidationError | AppError.UnexpectedError,
  Result<Facility>
>;

@Injectable()
export class CreateFacilityCase
  implements UseCase<CreateFacilityDto, Promise<CreateFacilityResponse>> {
  constructor(
    private repository: FacilityRepository,
    private facilityFactory: FacilityFactory,
    private publisher: EventPublisher,
  ) {}

  async execute(
    dto: CreateFacilityDto,
    enterpriseId: string,
  ): Promise<CreateFacilityResponse> {
    try {
      const slug = Slug.create({ value: dto.slug });
      const slugExists = await this.repository.slugExists(
        slug.getValue().value,
      );

      if (slugExists) {
        return left(new CreateFacilityErrors.SlugAlreadyExistsError());
      }

      const facilityOrError = this.facilityFactory.buildFromDto(
        dto,
        enterpriseId,
      );

      if (!facilityOrError.isSuccess) {
        return left(Result.fail(facilityOrError.error));
      }

      let facility = facilityOrError.getValue();
      const facilityEntity = await this.repository.persistModel(facility);
      const savedFacility = await facilityEntity.save();

      facility = this.publisher.mergeObjectContext(facility);
      facility.apply(
        new FacilityAddedEvent(enterpriseId, savedFacility.facility_id),
      );
      facility.commit();

      return right(Result.ok(facility));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
