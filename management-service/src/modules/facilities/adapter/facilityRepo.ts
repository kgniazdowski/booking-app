import { Facility } from '../domain';
import { FacilityEntity } from '../infra/entities';

export interface FacilityRepo {
  exists(facilityId: string): Promise<boolean>;
  slugExists(slug: string): Promise<boolean>;
  getRawFacilityBySlug(slug: string): Promise<FacilityEntity>;
  getRawFacilityById(facilityId: string): Promise<FacilityEntity>;
  persistModel(facility: Facility): Promise<FacilityEntity>;
  deleteFacility(facilityId: string): Promise<void>;
}
