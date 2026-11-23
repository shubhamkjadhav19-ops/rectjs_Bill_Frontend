export interface Party {
  name: string;
  address: string;
  gstNumber: string;
}

export interface ConsignmentItem {
  quantity: string;
  description: string;
  weight: string;
  rate: string;
  amount: string;
  payment: string;
  invoiceNumber: string;
}

export interface Charges {
  rto: string;
  additionalOtherCharges: string;
  hamali: string;
  other: string;
  door: string;
  station: string;
}

export interface Transporter {
  name: string;
  address: string;
  email: string;
  phone: string;
  alternatePhone: string;
  enrollmentNumber: string;
  jurisdiction: string;
}

export interface ConsignmentForm {
  transporter: Transporter;
  consignmentNumber: string;
  date: string;
  insuranceStatus: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insuranceDate: string;
  insuranceAmount: string;
  consignor: Party;
  consignee: Party;
  gstPayableBy: string;
  vehicleNumber: string;
  origin: string;
  destination: string;
  eWayBillNumber: string;
  items: ConsignmentItem[];
  charges: Charges;
  total: string;
  declaredValue: string;
  vehicleType: string;
  receiverName: string;
  notes: string;
}
