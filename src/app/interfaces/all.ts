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

export interface Employees extends Paginator {
  items: Employee[];
}

export interface Item {
  id: number | null;
  seq: number;
  productName: string;
  productCode: string;
  fixedAsset: number | null;
  serialNumber: number | null;
  expireDate: Date | null;
  unit: string;
  warehouseFrom: number | null;
  employeeFrom: string | null;
  currency: string;
  quantity: number;
  price: number;
  assignDate: Date | null;
  assignDocument: number | null;
  lot: number | null;
  employee: number | null;
  expand: {
    employee: Employee;
    project: Project;
  };
  project: number | null;
  created: Date | null;
  updated: Date | null;
}

export interface Items extends Paginator {
  items: Item[];
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
  items: string[] | null;
  expand: {
    items: Item[] | null;
  };
}

export interface WarehouseProduct {
  id: number;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  productCode: string;
  stockQuantity: number;
  reservedQuantity: number;
  arrivesQuantity: number;
  lot: number;
  fixedAssetNo: number;
  serialNumber: number;
  price: number;
  unit: string;
  created: Date;
  updated: Date;
}

export interface WarehouseProducts extends Paginator {
  items: WarehouseProduct[];
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

export interface SelectedProduct {
  productCode: number;
  lot: number;
  quantity: number;
}
