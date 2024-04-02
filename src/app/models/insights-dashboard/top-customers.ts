export interface ITopCustomer {
    customerEmail: string;
    emailCount: number;
    drilldownId: string;
    percentage: number;
  }
  
  export interface ITopCustomerDrilldown {
    customerEmail: string;
    drillDownId: string;
    drilldownData: IDrilldownData[];
  }
  
  export interface IDrilldownData {
    label: string;
    value: number;
  }
  