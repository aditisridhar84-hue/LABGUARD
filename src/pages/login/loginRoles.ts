export const LOGIN_ROLES = [
  { path: 'administrator', apiPath: 'administrator', role: 'administrator', label: 'Chief Administrator', access: 'Everything, including user administration', blocked: 'Nothing' },
  { path: 'laboratory-director', apiPath: 'laboratory-director', role: 'lab_manager', label: 'Laboratory Director', access: 'All laboratory operations', blocked: 'User administration' },
  { path: 'senior-lab-technician', apiPath: 'senior-lab-technician', role: 'technician', label: 'Senior Lab Technician', access: 'Orders, result entry, inventory, equipment, staff list', blocked: 'Result verification, billing, audit, users' },
  { path: 'clinical-pathologist', apiPath: 'clinical-pathologist', role: 'pathologist', label: 'Clinical Pathologist', access: 'Results, report approval, orders, doctors', blocked: 'Billing, pharmacy, equipment' },
  { path: 'finance-controller', apiPath: 'finance-controller', role: 'finance', label: 'Finance Controller', access: 'Billing, invoices, supplier ledger, inventory, pharmacy bills', blocked: 'Results, dispensing' },
  { path: 'registered-pharmacist', apiPath: 'registered-pharmacist', role: 'pharmacist', label: 'Registered Pharmacist', access: 'Pharmacy, patients, doctors, inventory', blocked: 'Billing, results' },
  { path: 'verified-patient', apiPath: 'verified-patient', role: 'patient', label: 'Verified Patient', access: 'Own record, reports, appointments, prescriptions, bills', blocked: "All staff APIs and other patients' records" },
] as const;
