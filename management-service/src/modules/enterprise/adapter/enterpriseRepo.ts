import { Enterprise } from '../domain';
import { EnterpriseEntity } from '../infra/entities';

export interface EnterpriseRepo {
  exists(enterpriseId: string): Promise<boolean>;
  getEnterpriseById(enterpriseId: string): Promise<Enterprise>;
  getRawEnterpriseById(enterpriseId: string): Promise<EnterpriseEntity>;
  addFacility(enterpriseId: string, facilityId: string): Promise<void>;
  removeFacility(enterpriseId: string, facilityId: string): Promise<void>;
}
