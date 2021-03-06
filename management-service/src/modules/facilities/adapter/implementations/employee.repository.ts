import { EntityRepository, Repository } from 'typeorm/index';

import { EmployeeEntity } from '../../infra/entities';
import { EmployeeRepo } from '../employeeRepo';
import { Employee } from '../../domain';
import { EmployeeMap } from './employee.map';

@EntityRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity>
  implements EmployeeRepo {
  async exists(employeeId: string): Promise<boolean> {
    try {
      await this.getEmployeeById(employeeId);
    } catch {
      return false;
    }

    return true;
  }

  async getEmployeeById(employeeId: string): Promise<Employee> {
    const employee = await this.findOne({ employee_id: employeeId });
    if (!employee) throw new Error('Employee not found');
    return EmployeeMap.toDomain(employee);
  }

  async getAllEmployees(facilityId: string): Promise<Employee[]> {
    const employees = await this.getRawAllEmployees(facilityId);
    return employees.length ? EmployeeMap.toDomainBulk(employees) : [];
  }

  async getRawEmployeeById(employeeId: string): Promise<EmployeeEntity> {
    const employee = await this.findOne({ employee_id: employeeId });
    if (!employee) throw new Error('Employee not found');
    return employee;
  }

  async getRawAllEmployees(facilityId: string): Promise<EmployeeEntity[]> {
    return await this.find({ facility_id: facilityId });
  }

  async persistModel(employee: Employee): Promise<EmployeeEntity> {
    return this.create(EmployeeMap.modelToPersistence(employee));
  }
}
