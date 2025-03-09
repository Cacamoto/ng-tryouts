import { AuthModel } from 'pocketbase';

export interface UserModel {
  isValid: boolean;
  authModel: AuthModel | null;
  token: string;
}

export interface Employee {
  id: number;
  employeeNumber: number;
  position: string;
  department: string;
  isWorking: boolean;
  email: string;
  phone: string;
  project: string;
  workingFrom: Date;
  workingTo: Date | null;
  firstName: string;
  lastName: string;
  employeeCode: string;
  employeeItems: string[] | null;
  created: Date;
  updated: Date;
  expand: {
    employeeItems: Item[] | null;
  };
}

export interface Item {
  id: number;
  seq: number;
  productName: string;
  productCode: string;
  fixedAsset: number | null;
  serialNumber: number | null;
  expireDate: Date | null;
  unit: string;
  warehouseFrom: number | null;
  employeeFrom: string;
  currency: string;
  quantity: number;
  price: number;
  assignDate: Date | null;
  assignDocument: number | null;
  created: Date;
  updated: Date;
}

export interface Project {
  id: number;
  number: string;
  name: string;
  owner: string;
  partner: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  currency: string;
  created: Date;
  updated: Date;
}

export interface Projects extends Paginator {
  items: Project[];
}

export interface Paginator {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
