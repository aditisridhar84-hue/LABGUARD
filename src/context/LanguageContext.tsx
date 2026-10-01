import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type LanguageCode = 'en' | 'hi' | 'kn';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

export const translations: Translations = {
  // Brand & General
  appName: {
    en: 'LABGUARD AI',
    hi: 'लैबगार्ड एआई',
    kn: 'ಲ್ಯಾಬ್‌ಗಾರ್ಡ್ ಎಐ'
  },
  tagline: {
    en: 'Private Laboratory & Pharmacy Intelligence Platform',
    hi: 'निजी प्रयोगशाला और फार्मेसी इंटेलिजेंस प्लेटफॉर्म',
    kn: 'ಖಾಸಗಿ ಪ್ರಯೋಗಾಲಯ ಮತ್ತು ಔಷಧಾಲಯ ಬುದ್ಧಿಮತ್ತೆ ವೇದಿಕೆ'
  },
  railwayHmisNotice: {
    en: 'Railway-HMIS Architecture Pattern · Secure Multi-Role Clinical Workflow',
    hi: 'रेलवे-एचएमआईएस आर्किटेक्चर पैटर्न · सुरक्षित बहु-भूमिका नैदानिक वर्कफ़्लो',
    kn: 'ರೈಲ್ವೆ-ಎಚ್‌ಎಂಐಎಸ್ ವಾಸ್ತುಶಿಲ್ಪ ಶೈಲಿ · ಸುರಕ್ಷಿತ ಬಹು-ಪಾತ್ರ ಕ್ಲಿನಿಕಲ್ ಕೆಲಸದ ಹರಿವು'
  },
  
  // Navigation Tabs
  navDashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'
  },
  navPatients: {
    en: 'Patients (OPD/IPD)',
    hi: 'मरीज़ (ओपीडी/आईपीडी)',
    kn: 'ರೋಗಿಗಳು (ಒಪಿಡಿ/ಐಪಿಡಿ)'
  },
  navTestOrders: {
    en: 'Test Orders',
    hi: 'परीक्षण आदेश',
    kn: 'ಪರೀಕ್ಷಾ ಆದೇಶಗಳು'
  },
  navResults: {
    en: 'Results & Verification',
    hi: 'परिणाम और सत्यापन',
    kn: 'ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಪರಿಶೀಲನೆ'
  },
  navCatalog: {
    en: 'Test Catalog',
    hi: 'परीक्षण सूची',
    kn: 'ಪರೀಕ್ಷಾ ಪಟ್ಟಿ'
  },
  navInventory: {
    en: 'Reagents & Inventory',
    hi: 'अभिकर्मक और इन्वेंटरी',
    kn: 'ರೀಜೆಂಟ್‌ಗಳು ಮತ್ತು ದಾಸ್ತಾನು'
  },
  navPharmacy: {
    en: 'Hospital Pharmacy',
    hi: 'अस्पताल फार्मेसी',
    kn: 'ಆಸ್ಪತ್ರೆ ಔಷಧಾಲಯ'
  },
  navDoctors: {
    en: 'Doctors & OPD Roster',
    hi: 'डॉक्टर और ओपीडी रोस्टर',
    kn: 'ವೈದ್ಯರು ಮತ್ತು ಒಪಿಡಿ ವೇಳಾಪಟ್ಟಿ'
  },
  navPatientPortal: {
    en: 'Patient Health Portal',
    hi: 'रोगी स्वास्थ्य पोर्टल',
    kn: 'ರೋಗಿ ಆರೋಗ್ಯ ಪೋರ್ಟಲ್'
  },
  navEquipment: {
    en: 'Analyzers & Equipment',
    hi: 'विश्लेषक और उपकरण',
    kn: 'ವಿಶ್ಲೇಷಕಗಳು ಮತ್ತು ಉಪಕರಣಗಳು'
  },
  navStaff: {
    en: 'Staff Directory',
    hi: 'कर्मचारी निर्देशिका',
    kn: 'ಸಿಬ್ಬಂದಿ ವಿವರ'
  },
  navSuppliers: {
    en: 'Suppliers & Vendors',
    hi: 'आपूर्तिकर्ता और विक्रेता',
    kn: 'ಸರಬರಾಜುದಾರರು ಮತ್ತು ಮಾರಾಟಗಾರರು'
  },
  navBilling: {
    en: 'Billing & Invoices',
    hi: 'बिलिंग और चालान',
    kn: 'ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಇನ್ವಾಯ್ಸ್‌ಗಳು'
  },
  navRiskCenter: {
    en: 'AI Risk Registry',
    hi: 'एआई जोखिम रजिस्ट्री',
    kn: 'ಎಐ ಅಪಾಯ ನೋಂದಣಿ'
  },
  navRecommendations: {
    en: 'Action Center',
    hi: 'कार्रवाई केंद्र',
    kn: 'ಕ್ರಿಯಾ ಕೇಂದ್ರ'
  },
  navSimulator: {
    en: 'What-If Simulator',
    hi: 'व्हाट-इफ सिम्युलेटर',
    kn: 'ಪೂರ್ವಭಾವಿ ಸಿಮ್ಯುಲೇಟರ್'
  },
  navAudit: {
    en: 'Audit Trail',
    hi: 'ऑडिट ट्रेल',
    kn: 'ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಾಖಲೆ'
  },
  navIntegrations: {
    en: 'Integrations & EDI',
    hi: 'एकीकरण और ईडीआई',
    kn: 'ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಇಡಿಐ'
  },
  navCopilot: {
    en: 'Smart Lab Copilot',
    hi: 'स्मार्ट लैब कोपायलट',
    kn: 'ಸ್ಮಾರ್ಟ್ ಲ್ಯಾಬ್ ಕೋಪೈಲಟ್'
  },
  navExecutiveBrief: {
    en: 'AI Executive Brief',
    hi: 'एआई कार्यकारी सारांश',
    kn: 'ಎಐ ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ'
  },
  navControlCenter: {
    en: 'Sovereign Control Center',
    hi: 'संप्रभु नियंत्रण केंद्र',
    kn: 'ಸಾರ್ವಭೌಮ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ'
  },
  navPrivateProcessing: {
    en: 'Private Data Pipeline',
    hi: 'निजी डेटा पाइपलाइन',
    kn: 'ಖಾಸಗಿ ಡೇಟಾ ಪೈಪ್‌ಲೈನ್'
  },
  navUpload: {
    en: 'Upload Laboratory CSV',
    hi: 'प्रयोगशाला सीएसवी अपलोड करें',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಸಿಎಸ್‌ವಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  navGovernance: {
    en: 'Data Governance Policies',
    hi: 'डेटा शासन नीतियां',
    kn: 'ಡೇಟಾ ಆಡಳಿತ ನೀತಿಗಳು'
  },
  navImpact: {
    en: 'Laboratory Impact',
    hi: 'प्रयोगशाला प्रभाव',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಪ್ರಭಾವ'
  },
  groupLabOps: {
    en: 'Laboratory Operations',
    hi: 'प्रयोगशाला संचालन',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಕಾರ್ಯಾಚರಣೆಗಳು'
  },
  groupHealthRecords: {
    en: 'Personal Health Records',
    hi: 'व्यक्तिगत स्वास्थ्य रिकॉर्ड',
    kn: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು'
  },
  groupAiIntel: {
    en: 'AI Intelligence & Risk',
    hi: 'एआई इंटेलिजेंस और जोखिम',
    kn: 'ಎಐ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮತ್ತು ಅಪಾಯ'
  },
  groupSovereignGov: {
    en: 'Sovereign AI Governance',
    hi: 'संप्रभु एआई शासन',
    kn: 'ಸಾರ್ವಭೌಮ ಎಐ ಆಡಳಿತ'
  },
  groupDataImpact: {
    en: 'Data & Impact',
    hi: 'डेटा और प्रभाव',
    kn: 'ಡೇಟಾ ಮತ್ತು ಪ್ರಭಾವ'
  },

  // Auth & Roles
  roleAdmin: {
    en: 'Chief Administrator',
    hi: 'मुख्य प्रशासक',
    kn: 'ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ'
  },
  roleLabManager: {
    en: 'Laboratory Director',
    hi: 'प्रयोगशाला निदेशक',
    kn: 'ಪ್ರಯೋಗಾಲಯ ನಿರ್ದೇಶಕ'
  },
  rolePathologist: {
    en: 'Clinical Pathologist',
    hi: 'क्लिनिकल पैथोलॉजिस्ट',
    kn: 'ಕ್ಲಿನಿಕಲ್ ರೋಗಶಾಸ್ತ್ರಜ್ಞ'
  },
  roleTechnician: {
    en: 'Senior Lab Technician',
    hi: 'वरिष्ठ लैब तकनीशियन',
    kn: 'ಹಿರಿಯ ಲ್ಯಾಬ್ ತಂತ್ರಜ್ಞ'
  },
  roleFinance: {
    en: 'Finance Controller',
    hi: 'वित्त नियंत्रक',
    kn: 'ಹಣಕಾಸು ನಿಯಂತ್ರಕ'
  },
  rolePharmacist: {
    en: 'Registered Pharmacist',
    hi: 'पंजीकृत फार्मासिस्ट',
    kn: 'ನೋಂದಾಯಿತ ಔಷಧಶಾಸ್ತ್ರಜ್ಞ'
  },
  rolePatient: {
    en: 'Verified Patient (OPD)',
    hi: 'सत्यापित मरीज़ (ओपीडी)',
    kn: 'ದೃಢೀಕೃತ ರೋಗಿ (ಒಪಿಡಿ)'
  },
  staffPortal: {
    en: 'Hospital Staff Portal',
    hi: 'अस्पताल कर्मचारी पोर्टल',
    kn: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್'
  },
  patientPortal: {
    en: 'Patient Self-Service Portal',
    hi: 'रोगी स्व-सेवा पोर्टल',
    kn: 'ರೋಗಿ ಸ್ವ-ಸೇವಾ ಪೋರ್ಟಲ್'
  },
  loginBtn: {
    en: 'Sign In',
    hi: 'साइन इन करें',
    kn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ'
  },
  logoutBtn: {
    en: 'Logout',
    hi: 'लॉग आउट',
    kn: 'ಲಾಗ್ ಔಟ್'
  },
  profileBtn: {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल',
    kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್'
  },
  inspectTrace: {
    en: 'Inspect Trace',
    hi: 'ट्रेस निरीक्षण करें',
    kn: 'ಟ್ರೆಸ್ ಪರಿಶೀಲಿಸಿ'
  },
  doctorAvailability: {
    en: 'Doctor Availability',
    hi: 'डॉक्टर उपलब्धता',
    kn: 'ವೈದ್ಯರ ಲಭ್ಯತೆ'
  },

  // Actions & Search
  alerts: {
    en: 'System Alerts & Notifications',
    hi: 'सिस्टम अलर्ट और सूचनाएं',
    kn: 'ವ್ಯವಸ್ಥೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು'
  },
  searchPlaceholder: {
    en: 'Search patients, orders, reagents, doctors, drugs, equipment...',
    hi: 'मरीज़, परीक्षण, अभिकर्मक, डॉक्टर, दवाएं खोजें...',
    kn: 'ರೋಗಿಗಳು, ಆದೇಶಗಳು, ಔಷಧಿಗಳು, ವೈದ್ಯರನ್ನು ಹುಡುಕಿ...'
  },
  applyFilter: {
    en: 'Filter',
    hi: 'फ़िल्टर करें',
    kn: 'ಫಿಲ್ಟರ್ ಮಾಡಿ'
  },
  refresh: {
    en: 'Refresh Data',
    hi: 'डेटा ताज़ा करें',
    kn: 'ಡೇಟಾ ಮರುಹೊಂದಿಸಿ'
  },
  saveChanges: {
    en: 'Save Changes',
    hi: 'बदलाव सहेजें',
    kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ'
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    kn: 'ರದ್ದುಮಾಡಿ'
  },
  downloadReport: {
    en: 'Download Verified Report',
    hi: 'सत्यापित रिपोर्ट डाउनलोड करें',
    kn: 'ದೃಢೀಕೃತ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  bookAppointment: {
    en: 'Book OPD Appointment',
    hi: 'ओपीडी अपॉइंटमेंट बुक करें',
    kn: 'ಒಪಿಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ'
  },
  dispenseMed: {
    en: 'Dispense Medicines',
    hi: 'दवाएं वितरित करें',
    kn: 'ಔಷಧಿಗಳನ್ನು ವಿತರಿಸಿ'
  },
  restock: {
    en: 'Restock Batch',
    hi: 'बैच पुनः स्टॉक करें',
    kn: 'ದಾಸ್ತಾನು ಮರುಪೂರಣ'
  },
  statusOnDuty: {
    en: 'ON DUTY',
    hi: 'ड्यूटी पर',
    kn: 'ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ'
  },
  statusAvailable: {
    en: 'AVAILABLE',
    hi: 'उपलब्ध',
    kn: 'ಲಭ್ಯವಿದೆ'
  },
  statusInConsult: {
    en: 'IN CONSULTATION',
    hi: 'परामर्श में',
    kn: 'ಸಮಾಲೋಚನೆಯಲ್ಲಿ'
  },
  statusOnLeave: {
    en: 'ON LEAVE',
    hi: 'छुट्टी पर',
    kn: 'ರಜೆಯಲ್ಲಿದ್ದಾರೆ'
  },
  statusActive: {
    en: 'Active',
    hi: 'सक्रिय',
    kn: 'ಸಕ್ರಿಯ'
  },
  statusCompleted: {
    en: 'Completed',
    hi: 'पूर्ण',
    kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ'
  },
  statusPending: {
    en: 'Pending',
    hi: 'लंबित',
    kn: 'ಬಾಕಿ ಇದೆ'
  },
  statusVerified: {
    en: 'Verified',
    hi: 'सत्यापित',
    kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ'
  },
  tokenNumber: {
    en: 'Token Number',
    hi: 'टोकन संख्या',
    kn: 'ಟೋಕನ್ ಸಂಖ್ಯೆ'
  },
  noResultsFound: {
    en: 'No matching records found',
    hi: 'कोई मेल खाने वाला रिकॉर्ड नहीं मिला',
    kn: 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
  },
  searchingRecords: {
    en: 'Searching across laboratory databases...',
    hi: 'प्रयोगशाला डेटाबेस में खोज की जा रही है...',
    kn: 'ಪ್ರಯೋಗಾಲಯದ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...'
  },
  totalToday: {
    en: 'Total Today',
    hi: 'आज का कुल',
    kn: 'ಇಂದಿನ ಒಟ್ಟು'
  },
  completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ'
  },
  pendingTests: {
    en: 'Pending Tests',
    hi: 'लंबित परीक्षण',
    kn: 'ಬಾಕಿ ಇರುವ ಪರೀಕ್ಷೆಗಳು'
  },
  averageTat: {
    en: 'Average TAT',
    hi: 'औसत टर्नअराउंड समय',
    kn: 'ಸರಾಸರಿ ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ'
  },
  todayRevenue: {
    en: 'Today Revenue',
    hi: 'आज का राजस्व',
    kn: 'ಇಂದಿನ ಆದಾಯ'
  },
  criticalRisks: {
    en: 'Critical Risks',
    hi: 'गंभीर जोखिम',
    kn: 'ಗಂಭೀರ ಅಪಾಯಗಳು'
  },
  activeDoctors: {
    en: 'Active Doctors',
    hi: 'सक्रिय डॉक्टर',
    kn: 'ಸಕ್ರಿಯ ವೈದ್ಯರು'
  },
  lowStockReagents: {
    en: 'Low Stock Reagents',
    hi: 'कम स्टॉक अभिकर्मक',
    kn: 'ಕಡಿಮೆ ದಾಸ್ತಾನು ರೀಜೆಂಟ್‌ಗಳು'
  },
  todayLabBrief: {
    en: "Today's Laboratory Brief",
    hi: 'आज का प्रयोगशाला सारांश',
    kn: 'ಇಂದಿನ ಪ್ರಯೋಗಾಲಯ ಸಾರಾಂಶ'
  },
  priorityFlags: {
    en: 'Priority Flags',
    hi: 'प्राथमिकता झंडे',
    kn: 'ಆದ್ಯತೆಯ ಧ್ವಜಗಳು'
  },
  reviewRisks: {
    en: 'Review Risks',
    hi: 'जोखिमों की समीक्षा करें',
    kn: 'ಅಪಾಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ'
  },
  viewRecommendations: {
    en: 'View Recommendations',
    hi: 'सिफारिशें देखें',
    kn: 'ಶಿಫಾರಸುಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
  },
  testVolumeTrends: {
    en: '14-Day Test Volume & Trajectory',
    hi: '14-दिवसीय परीक्षण मात्रा और रुझान',
    kn: '14-ದಿನಗಳ ಪರೀಕ್ಷಾ ಪ್ರಮಾಣ ಮತ್ತು ಪ್ರವೃತ್ತಿ'
  },
  departmentDistribution: {
    en: 'Departmental Specimen Distribution',
    hi: 'विभागीय नमूना वितरण',
    kn: 'ವಿಭಾಗೀಯ ಮಾದರಿ ವಿತರಣೆ'
  },
  tatComplianceDistribution: {
    en: 'Turnaround Time Compliance Distribution',
    hi: 'टर्नअराउंड समय अनुपालन वितरण',
    kn: 'ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ ಅನುಸರಣೆ ವಿತರಣೆ'
  },
  activeRisksHeading: {
    en: 'Active Operational Risks Detected by AI',
    hi: 'एआई द्वारा पहचाने गए सक्रिय परिचालन जोखिम',
    kn: 'ಎಐ ಮೂಲಕ ಪತ್ತೆಯಾದ ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣೆಯ ಅಪಾಯಗಳು'
  },
  viewAllRisks: {
    en: 'View All in Risk Center',
    hi: 'जोखिम केंद्र में सभी देखें',
    kn: 'ಅಪಾಯ ಕೇಂದ್ರದಲ್ಲಿ ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ'
  },
  healthStatus: {
    en: 'Health',
    hi: 'स्वास्थ्य',
    kn: 'ಆರೋಗ್ಯ'
  },
  demoMode: {
    en: 'DEMO MODE',
    hi: 'डेमो मोड',
    kn: 'ಡೆಮೊ ಮೋಡ್'
  },
  roleLabel: {
    en: 'Role',
    hi: 'भूमिका',
    kn: 'ಪಾತ್ರ'
  },
  backToWorkspace: {
    en: 'Return to Workspace',
    hi: 'कार्यक्षेत्र पर लौटें',
    kn: 'ಕಾರ್ಯಕ್ಷೇತ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿ'
  },
  otpVerification: {
    en: 'OTP Verification',
    hi: 'ओटीपी सत्यापन',
    kn: 'ಒಟಿಪಿ ಪರಿಶೀಲನೆ'
  },
  requestOtp: {
    en: 'Request OTP',
    hi: 'ओटीपी का अनुरोध करें',
    kn: 'ಒಟಿಪಿಗೆ ವಿನಂತಿಸಿ'
  },
  resendOtp: {
    en: 'Resend OTP',
    hi: 'ओटीपी पुनः भेजें',
    kn: 'ಒಟಿಪಿಯನ್ನು ಮರುಕಳುಹಿಸಿ'
  },
  enterOtp: {
    en: 'Enter 6-Digit Verification Code',
    hi: '6 अंकों का सत्यापन कोड दर्ज करें',
    kn: '6-ಅಂಕಿಯ ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ'
  },
  archiveSafe: {
    en: 'Archive Record (Safe)',
    hi: 'रिकॉर्ड संग्रहीत करें (सुरक्षित)',
    kn: 'ದಾಖಲೆಯನ್ನು ಆರ್ಕೈವ್ ಮಾಡಿ (ಸುರಕ್ಷಿತ)'
  },
  forceDelete: {
    en: 'Force Delete',
    hi: 'जबरन हटाएं',
    kn: 'ಬಲವಂತವಾಗಿ ಅಳಿಸಿ'
  },
  turnaroundTime: {
    en: 'Turnaround Time',
    hi: 'टर्नअराउंड समय',
    kn: 'ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ'
  },
  permissionRestricted: {
    en: 'Access restricted for current role',
    hi: 'वर्तमान भूमिका के लिए पहुंच प्रतिबंधित है',
    kn: 'ಪ್ರಸ್ತುತ ಪಾತ್ರಕ್ಕೆ ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ'
  },
  billingTitle: {
    en: 'Billing & Invoices Management',
    hi: 'बिलिंग और चालान प्रबंधन',
    kn: 'ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಇನ್‌ವಾಯ್ಸ್ ನಿರ್ವಹಣೆ'
  },
  billingDescription: {
    en: 'Real-time outpatient receipts, digital payments, and insurance receivables.',
    hi: 'रीयल-टाइम ओपीडी रसीदें, डिजिटल भुगतान और बीमा प्राप्य।',
    kn: 'ನೈಜ-ಸಮಯದ ಹೊರರೋಗಿ ರಸೀದಿಗಳು, ಡಿಜಿಟಲ್ ಪಾವತಿಗಳು ಮತ್ತು ವಿಮಾ ಸ್ವೀಕೃತಿಗಳು.'
  },
  todayRealizedRevenue: {
    en: "Today's Realized Revenue",
    hi: 'आज का प्राप्त राजस्व',
    kn: 'ಇಂದಿನ ವಾಸ್ತವಿಕ ಆದಾಯ'
  },
  paidInvoices: {
    en: 'Paid Invoices',
    hi: 'भुगतान किए गए चालान',
    kn: 'ಪಾವತಿಸಿದ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು'
  },
  immediateClearance: {
    en: 'Immediate Clearance',
    hi: 'तत्काल निपटान',
    kn: 'ತಕ್ಷಣದ ಪಾವತಿ'
  },
  pendingInsurance: {
    en: 'Pending Insurance (TPA)',
    hi: 'लंबित बीमा (टीपीए)',
    kn: 'ಬಾಕಿ ಇರುವ ವಿಮೆ (ಟಿಪಿಎ)'
  },
  underClaimAdjudication: {
    en: 'Under claim adjudication',
    hi: 'दावे का मूल्यांकन जारी है',
    kn: 'ವಿಮಾ ಕ್ಲೈಮ್ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ'
  },
  averageBillValue: {
    en: 'Average Bill Value',
    hi: 'औसत बिल राशि',
    kn: 'ಸರಾಸರಿ ಬಿಲ್ ಮೊತ್ತ'
  },
  perPatientEncounter: {
    en: 'Per patient test encounter',
    hi: 'प्रति मरीज जांच',
    kn: 'ಪ್ರತಿ ರೋಗಿಯ ಪರೀಕ್ಷಾ ಭೇಟಿಗೆ'
  },
  digitalCollectionShare: {
    en: 'Digital Collection Share',
    hi: 'डिजिटल संग्रह का हिस्सा',
    kn: 'ಡಿಜಿಟಲ್ ಸಂಗ್ರಹದ ಪಾಲು'
  },
  digitalPaymentMethods: {
    en: 'UPI & card payments',
    hi: 'यूपीआई और कार्ड भुगतान',
    kn: 'ಯುಪಿಐ ಮತ್ತು ಕಾರ್ಡ್ ಪಾವತಿಗಳು'
  },
  searchInvoices: {
    en: 'Search invoice ID or patient...',
    hi: 'चालान आईडी या मरीज खोजें...',
    kn: 'ಇನ್‌ವಾಯ್ಸ್ ಐಡಿ ಅಥವಾ ರೋಗಿಯನ್ನು ಹುಡುಕಿ...'
  },
  allInvoices: {
    en: 'All Invoices',
    hi: 'सभी चालान',
    kn: 'ಎಲ್ಲಾ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು'
  },
  pendingPartial: {
    en: 'Pending / Partial',
    hi: 'लंबित / आंशिक',
    kn: 'ಬಾಕಿ / ಭಾಗಶಃ'
  },
  invoiceId: {
    en: 'Invoice ID',
    hi: 'चालान आईडी',
    kn: 'ಇನ್‌ವಾಯ್ಸ್ ಐಡಿ'
  },
  patient: {
    en: 'Patient',
    hi: 'मरीज',
    kn: 'ರೋಗಿ'
  },
  associatedOrder: {
    en: 'Associated Order',
    hi: 'संबंधित जांच आदेश',
    kn: 'ಸಂಬಂಧಿತ ಪರೀಕ್ಷಾ ಆದೇಶ'
  },
  billedAmount: {
    en: 'Billed Amount',
    hi: 'बिल की राशि',
    kn: 'ಬಿಲ್ ಮೊತ್ತ'
  },
  discount: {
    en: 'Discount',
    hi: 'छूट',
    kn: 'ರಿಯಾಯಿತಿ'
  },
  netPaid: {
    en: 'Net Paid',
    hi: 'शुद्ध भुगतान',
    kn: 'ನಿವ್ವಳ ಪಾವತಿ'
  },
  paymentMethod: {
    en: 'Method',
    hi: 'भुगतान विधि',
    kn: 'ಪಾವತಿ ವಿಧಾನ'
  },
  dateTime: {
    en: 'Date / Time',
    hi: 'दिनांक / समय',
    kn: 'ದಿನಾಂಕ / ಸಮಯ'
  },
  paymentStatus: {
    en: 'Payment Status',
    hi: 'भुगतान स्थिति',
    kn: 'ಪಾವತಿ ಸ್ಥಿತಿ'
  },
  noMatchingInvoices: {
    en: 'No invoices match your search and status filter.',
    hi: 'आपकी खोज और स्थिति फ़िल्टर से कोई चालान मेल नहीं खाता।',
    kn: 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಮತ್ತು ಸ್ಥಿತಿ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಇನ್‌ವಾಯ್ಸ್ ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ.'
  },
  noBillingRecords: {
    en: 'No billing records are available for this account.',
    hi: 'इस खाते के लिए कोई बिलिंग रिकॉर्ड उपलब्ध नहीं है।',
    kn: 'ಈ ಖಾತೆಗೆ ಯಾವುದೇ ಬಿಲ್ಲಿಂಗ್ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ.'
  },
  impactToday: {
    en: 'Today',
    hi: 'आज',
    kn: 'ಇಂದು'
  },
  impact7Days: {
    en: '7 Days',
    hi: '7 दिन',
    kn: '7 ದಿನಗಳು'
  },
  impactMonth: {
    en: 'Month',
    hi: 'महीना',
    kn: 'ತಿಂಗಳು'
  },
  impactQuarter: {
    en: 'Quarter',
    hi: 'तिमाही',
    kn: 'ತ್ರೈಮಾಸಿಕ'
  },
  overallCompletionRate: {
    en: 'Overall Completion Rate',
    hi: 'कुल पूर्णता दर',
    kn: 'ಒಟ್ಟು ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ ದರ'
  },
  verifiedTests: {
    en: 'Verified Tests',
    hi: 'सत्यापित जांच',
    kn: 'ಪರಿಶೀಲಿಸಿದ ಪರೀಕ್ಷೆಗಳು'
  },
  revenueLeakageAverted: {
    en: 'Revenue Leakage Averted',
    hi: 'राजस्व हानि रोकी गई',
    kn: 'ಆದಾಯ ಸೋರಿಕೆ ತಡೆಗಟ್ಟಲಾಗಿದೆ'
  },
  criticalStockItems: {
    en: 'Critical Stock Items',
    hi: 'गंभीर रूप से कम स्टॉक वाली वस्तुएं',
    kn: 'ಗಂಭೀರವಾಗಿ ಕಡಿಮೆ ದಾಸ್ತಾನು ವಸ್ತುಗಳು'
  },
  noOrdersInPeriod: {
    en: 'No laboratory orders in the selected period.',
    hi: 'चयनित अवधि में कोई प्रयोगशाला आदेश नहीं है।',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯಲ್ಲಿ ಯಾವುದೇ ಪ್ರಯೋಗಾಲಯ ಆದೇಶಗಳಿಲ್ಲ.'
  },
  appointmentWorklist: {
    en: 'OPD Queue & Scheduled Appointments',
    hi: 'ओपीडी कतार और निर्धारित अपॉइंटमेंट',
    kn: 'ಒಪಿಡಿ ಸರದಿ ಮತ್ತು ನಿಗದಿತ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು'
  },
  liveSync: {
    en: 'Live Sync',
    hi: 'लाइव सिंक',
    kn: 'ನೇರ ಸಿಂಕ್'
  },
  consultingDoctor: {
    en: 'Consulting Doctor',
    hi: 'परामर्शदाता डॉक्टर',
    kn: 'ಸಮಾಲೋಚಕ ವೈದ್ಯರು'
  },
  appointmentDate: {
    en: 'Date',
    hi: 'दिनांक',
    kn: 'ದಿನಾಂಕ'
  },
  timeSlot: {
    en: 'Time Slot',
    hi: 'समय स्लॉट',
    kn: 'ಸಮಯದ ಅವಧಿ'
  },
  consultationType: {
    en: 'Consultation Type',
    hi: 'परामर्श का प्रकार',
    kn: 'ಸಮಾಲೋಚನೆಯ ವಿಧ'
  },
  appointmentStatus: {
    en: 'Status',
    hi: 'स्थिति',
    kn: 'ಸ್ಥಿತಿ'
  },
  queueAction: {
    en: 'Queue Action',
    hi: 'कतार कार्रवाई',
    kn: 'ಸರದಿ ಕ್ರಿಯೆ'
  },
  scheduleAppointment: {
    en: 'Schedule OPD Appointment',
    hi: 'ओपीडी अपॉइंटमेंट निर्धारित करें',
    kn: 'ಒಪಿಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ'
  },
  selectDoctor: {
    en: 'Select Doctor',
    hi: 'डॉक्टर चुनें',
    kn: 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ'
  },
  patientUhid: {
    en: 'Patient UHID',
    hi: 'मरीज यूएचआईडी',
    kn: 'ರೋಗಿಯ ಯುಎಚ್‌ಐಡಿ'
  },
  patientName: {
    en: 'Patient Name',
    hi: 'मरीज का नाम',
    kn: 'ರೋಗಿಯ ಹೆಸರು'
  },
  confirmIssueToken: {
    en: 'Confirm & Issue Token',
    hi: 'पुष्टि करें और टोकन जारी करें',
    kn: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಟೋಕನ್ ನೀಡಿ'
  },
  noAppointmentsScheduled: {
    en: 'No appointments have been scheduled.',
    hi: 'अभी तक कोई अपॉइंटमेंट निर्धारित नहीं है।',
    kn: 'ಇನ್ನೂ ಯಾವುದೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ನಿಗದಿಪಡಿಸಿಲ್ಲ.'
  },
  impactSectionLabel: {
    en: 'Operational ROI & Health Outcomes',
    hi: 'परिचालन लाभ और स्वास्थ्य परिणाम',
    kn: 'ಕಾರ್ಯಾಚರಣೆಯ ಲಾಭ ಮತ್ತು ಆರೋಗ್ಯ ಫಲಿತಾಂಶಗಳು'
  },
  impactTitle: {
    en: 'Laboratory Impact & Optimization Analytics',
    hi: 'प्रयोगशाला प्रभाव और अनुकूलन विश्लेषण',
    kn: 'ಪ್ರಯೋಗಾಲಯದ ಪರಿಣಾಮ ಮತ್ತು ಅತ್ಯುತ್ತಮೀಕರಣ ವಿಶ್ಲೇಷಣೆ'
  },
  impactDescription: {
    en: "Performance metrics, turnaround reductions, and savings from NovaCare's database.",
    hi: 'NovaCare डेटाबेस से प्रदर्शन मेट्रिक्स, टर्नअराउंड में कमी और बचत।',
    kn: 'NovaCare ಡೇಟಾಬೇಸ್‌ನ ಕಾರ್ಯಕ್ಷಮತೆ, ಸಮಯ ಕಡಿತ ಮತ್ತು ಉಳಿತಾಯದ ಅಂಕಿಅಂಶಗಳು.'
  },
  departmentVelocity: {
    en: 'Departmental Operational Velocity Breakdown',
    hi: 'विभागीय परिचालन गति विवरण',
    kn: 'ವಿಭಾಗವಾರು ಕಾರ್ಯಾಚರಣೆಯ ವೇಗದ ವಿವರ'
  },
  noData: {
    en: 'No data',
    hi: 'कोई डेटा नहीं',
    kn: 'ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ'
  },
  pharmacyBills: {
    en: 'Pharmacy Bills',
    hi: 'फार्मेसी बिल',
    kn: 'ಔಷಧಾಲಯದ ಬಿಲ್‌ಗಳು'
  },
  pharmacyBillsDescription: {
    en: 'Pharmacy transactions and payment status',
    hi: 'फार्मेसी लेनदेन और भुगतान स्थिति',
    kn: 'ಔಷಧಾಲಯದ ವಹಿವಾಟುಗಳು ಮತ್ತು ಪಾವತಿ ಸ್ಥಿತಿ'
  },
  searchPharmacyBills: {
    en: 'Search bill, patient, or ID...',
    hi: 'बिल, मरीज या आईडी खोजें...',
    kn: 'ಬಿಲ್, ರೋಗಿ ಅಥವಾ ಐಡಿಯನ್ನು ಹುಡುಕಿ...'
  },
  allPayments: {
    en: 'All payments',
    hi: 'सभी भुगतान',
    kn: 'ಎಲ್ಲಾ ಪಾವತಿಗಳು'
  },
  paid: {
    en: 'Paid',
    hi: 'भुगतान किया गया',
    kn: 'ಪಾವತಿಸಲಾಗಿದೆ'
  },
  pending: {
    en: 'Pending',
    hi: 'लंबित',
    kn: 'ಬಾಕಿ ಇದೆ'
  },
  billNumber: {
    en: 'Bill',
    hi: 'बिल',
    kn: 'ಬಿಲ್'
  },
  items: {
    en: 'Items',
    hi: 'वस्तुएं',
    kn: 'ವಸ್ತುಗಳು'
  },
  total: {
    en: 'Total',
    hi: 'कुल',
    kn: 'ಒಟ್ಟು'
  },
  noMatchingPharmacyBills: {
    en: 'No bills match your search and payment filter.',
    hi: 'आपकी खोज और भुगतान फ़िल्टर से कोई बिल मेल नहीं खाता।',
    kn: 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಮತ್ತು ಪಾವತಿ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಬಿಲ್ ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ.'
  },
  noPharmacyBills: {
    en: 'No pharmacy bills are available.',
    hi: 'कोई फार्मेसी बिल उपलब्ध नहीं है।',
    kn: 'ಯಾವುದೇ ಔಷಧಾಲಯದ ಬಿಲ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.'
  },
  matchingRecords: {
    en: 'Matching records',
    hi: 'मेल खाते रिकॉर्ड',
    kn: 'ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು'
  },
  appointmentBookingFailed: {
    en: 'Could not book appointment',
    hi: 'अपॉइंटमेंट बुक नहीं हो सका',
    kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ'
  },
  appointmentBooked: {
    en: 'Appointment booked',
    hi: 'अपॉइंटमेंट बुक हो गया',
    kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಆಗಿದೆ'
  },
  ordersInSelectedPeriod: {
    en: 'Orders in selected period',
    hi: 'चयनित अवधि में आदेश',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯ ಆದೇಶಗಳು'
  },
  billsInSelectedPeriod: {
    en: 'Bills in selected period',
    hi: 'चयनित अवधि में बिल',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯ ಬಿಲ್‌ಗಳು'
  },
  orderVolume: {
    en: 'Order volume',
    hi: 'आदेश मात्रा',
    kn: 'ಆದೇಶಗಳ ಪ್ರಮಾಣ'
  },
  billedRevenue: {
    en: 'Billed revenue',
    hi: 'बिल किया गया राजस्व',
    kn: 'ಬಿಲ್ ಮಾಡಿದ ಆದಾಯ'
  },
  chooseSignIn: {
    en: 'Choose your sign-in',
    hi: 'अपना साइन-इन चुनें',
    kn: 'ನಿಮ್ಮ ಸೈನ್-ಇನ್ ಆಯ್ಕೆಮಾಡಿ'
  },
  needDemoAccount: {
    en: 'Need a demo account?',
    hi: 'डेमो खाते की आवश्यकता है?',
    kn: 'ಡೆಮೊ ಖಾತೆ ಬೇಕೆ?'
  },
  viewDemoCredentials: {
    en: 'View demo credentials',
    hi: 'डेमो क्रेडेंशियल देखें',
    kn: 'ಡೆಮೊ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ನೋಡಿ'
  },
  openDirectorSignIn: {
    en: 'Open Director sign-in',
    hi: 'निदेशक साइन-इन खोलें',
    kn: 'ನಿರ್ದೇಶಕರ ಸೈನ್-ಇನ್ ತೆರೆಯಿರಿ'
  },
  roleSignIn: {
    en: 'sign-in',
    hi: 'साइन-इन',
    kn: 'ಸೈನ್-ಇನ್'
  },
  signIn: {
    en: 'Sign in',
    hi: 'साइन इन करें',
    kn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ'
  },
  signInDescription: {
    en: 'Use the credentials issued to you by your organisation.',
    hi: 'अपने संगठन द्वारा दिए गए क्रेडेंशियल का उपयोग करें।',
    kn: 'ನಿಮ್ಮ ಸಂಸ್ಥೆ ನೀಡಿದ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ಬಳಸಿ.'
  },
  workEmailOrEmployeeId: {
    en: 'Work email or employee ID',
    hi: 'कार्य ईमेल या कर्मचारी आईडी',
    kn: 'ಕೆಲಸದ ಇಮೇಲ್ ಅಥವಾ ಉದ್ಯೋಗಿ ಐಡಿ'
  },
  password: {
    en: 'Password',
    hi: 'पासवर्ड',
    kn: 'ಪಾಸ್‌ವರ್ಡ್'
  },
  forgotPassword: {
    en: 'Forgot password?',
    hi: 'पासवर्ड भूल गए?',
    kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?'
  },
  signingIn: {
    en: 'Signing in',
    hi: 'साइन इन हो रहा है',
    kn: 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ'
  },
  chooseDifferentRole: {
    en: 'Choose a different role',
    hi: 'दूसरी भूमिका चुनें',
    kn: 'ಬೇರೆ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
  },
  lightTheme: {
    en: 'Light theme',
    hi: 'लाइट थीम',
    kn: 'ಲೈಟ್ ಥೀಮ್'
  },
  darkTheme: {
    en: 'Dark theme',
    hi: 'डार्क थीम',
    kn: 'ಡಾರ್ಕ್ ಥೀಮ್'
  },
  language: {
    en: 'Language',
    hi: 'भाषा',
    kn: 'ಭಾಷೆ'
  },
  patientLoginIdentifier: {
    en: 'Registered email or patient ID',
    hi: 'पंजीकृत ईमेल या मरीज आईडी',
    kn: 'ನೋಂದಾಯಿತ ಇಮೇಲ್ ಅಥವಾ ರೋಗಿಯ ಐಡಿ'
  },
  checkIn: {
    en: 'Check In',
    hi: 'चेक इन करें',
    kn: 'ಚೆಕ್ ಇನ್ ಮಾಡಿ'
  },
  startConsultation: {
    en: 'Start Consult',
    hi: 'परामर्श शुरू करें',
    kn: 'ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ'
  },
  markComplete: {
    en: 'Mark Done',
    hi: 'पूर्ण चिह्नित करें',
    kn: 'ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ'
  },
  pleaseSelectDoctor: {
    en: 'Please select a valid doctor',
    hi: 'कृपया मान्य डॉक्टर चुनें',
    kn: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ'
  },
  couldNotBookAppointment: {
    en: 'Could not book appointment',
    hi: 'अपॉइंटमेंट बुक नहीं हो सका',
    kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ'
  },
  appointmentConfirmed: {
    en: 'OPD appointment booked! Token:',
    hi: 'ओपीडी अपॉइंटमेंट बुक हो गया! टोकन:',
    kn: 'ಒಪಿಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಆಗಿದೆ! ಟೋಕನ್:'
  },
  todaysRevenue: {
    en: "Today's Realized Revenue",
    hi: 'आज का प्राप्त राजस्व',
    kn: 'ಇಂದಿನ ವಾಸ್ತವಿಕ ಆದಾಯ'
  },
  allDepartments: {
    en: 'All Departments',
    hi: 'सभी विभाग',
    kn: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು'
  },
  allStatuses: {
    en: 'All Statuses',
    hi: 'सभी स्थितियां',
    kn: 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು'
  },
  doctorsOnDuty: {
    en: 'Doctors On Duty',
    hi: 'ड्यूटी पर डॉक्टर',
    kn: 'ಕರ್ತವ್ಯದಲ್ಲಿರುವ ವೈದ್ಯರು'
  },
  doctorRosterDescription: {
    en: 'Centralized OPD roster with real-time room allocation and consultation queues',
    hi: 'रीयल-टाइम कक्ष आवंटन और परामर्श कतारों के साथ केंद्रीकृत ओपीडी रोस्टर',
    kn: 'ನೈಜ-ಸಮಯದ ಕೊಠಡಿ ಹಂಚಿಕೆ ಮತ್ತು ಸಮಾಲೋಚನೆ ಸರದಿಗಳೊಂದಿಗೆ ಕೇಂದ್ರೀಕೃತ ಒಪಿಡಿ ಪಟ್ಟಿ'
  },
  noDoctorsFound: {
    en: 'No doctors match these filters.',
    hi: 'इन फ़िल्टरों से मेल खाने वाले डॉक्टर नहीं मिले।',
    kn: 'ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದುವ ವೈದ್ಯರು ಕಂಡುಬಂದಿಲ್ಲ.'
  },
  activeInOpd: {
    en: 'Active in OPD Chambers',
    hi: 'ओपीडी कक्षों में सक्रिय',
    kn: 'ಒಪಿಡಿ ಕೊಠಡಿಗಳಲ್ಲಿ ಸಕ್ರಿಯ'
  },
  availableForConsult: {
    en: 'Available For Consult',
    hi: 'परामर्श के लिए उपलब्ध',
    kn: 'ಸಮಾಲೋಚನೆಗೆ ಲಭ್ಯ'
  },
  immediateQueueAcceptance: {
    en: 'Immediate queue acceptance',
    hi: 'तत्काल कतार स्वीकृति',
    kn: 'ತಕ್ಷಣದ ಸರದಿ ಸ್ವೀಕಾರ'
  },
  totalOpdTokensBooked: {
    en: 'Total OPD Tokens Booked',
    hi: 'कुल बुक किए गए ओपीडी टोकन',
    kn: 'ಒಟ್ಟು ಬುಕ್ ಮಾಡಿದ ಒಪಿಡಿ ಟೋಕನ್‌ಗಳು'
  },
  todaysScheduledVisits: {
    en: "Today's scheduled visits",
    hi: 'आज की निर्धारित मुलाकातें',
    kn: 'ಇಂದಿನ ನಿಗದಿತ ಭೇಟಿಗಳು'
  },
  activeConsultations: {
    en: 'In Active Consultation',
    hi: 'सक्रिय परामर्श में',
    kn: 'ಸಕ್ರಿಯ ಸಮಾಲೋಚನೆಯಲ್ಲಿದ್ದಾರೆ'
  },
  patientsInChambers: {
    en: 'Patients inside chambers',
    hi: 'कक्षों में मरीज',
    kn: 'ಕೊಠಡಿಗಳಲ್ಲಿರುವ ರೋಗಿಗಳು'
  },
  searchDoctor: {
    en: 'Search doctor by name, specialty, or room...',
    hi: 'डॉक्टर को नाम, विशेषज्ञता या कक्ष से खोजें...',
    kn: 'ವೈದ್ಯರನ್ನು ಹೆಸರು, ವಿಶೇಷತೆ ಅಥವಾ ಕೊಠಡಿಯಿಂದ ಹುಡುಕಿ...'
  },
  clinicalDutyRoster: {
    en: 'Clinical Duty Roster',
    hi: 'चिकित्सकीय ड्यूटी रोस्टर',
    kn: 'ವೈದ್ಯಕೀಯ ಕರ್ತವ್ಯ ಪಟ್ಟಿ'
  },
  registeredDoctors: {
    en: 'registered doctors',
    hi: 'पंजीकृत डॉक्टर',
    kn: 'ನೋಂದಾಯಿತ ವೈದ್ಯರು'
  },
  opdHours: {
    en: 'OPD Hours',
    hi: 'ओपीडी समय',
    kn: 'ಒಪಿಡಿ ಸಮಯ'
  },
  doctorInformation: {
    en: 'Doctor Information',
    hi: 'डॉक्टर की जानकारी',
    kn: 'ವೈದ್ಯರ ಮಾಹಿತಿ'
  },
  departmentSpecialty: {
    en: 'Department & Specialty',
    hi: 'विभाग और विशेषज्ञता',
    kn: 'ವಿಭಾಗ ಮತ್ತು ವಿಶೇಷತೆ'
  },
  roomChamber: {
    en: 'Room / Chamber',
    hi: 'कक्ष / चैंबर',
    kn: 'ಕೊಠಡಿ / ಚೇಂಬರ್'
  },
  queueLoad: {
    en: 'Queue Load',
    hi: 'कतार भार',
    kn: 'ಸರದಿ ಒತ್ತಡ'
  },
  currentStatus: {
    en: 'Current Status',
    hi: 'वर्तमान स्थिति',
    kn: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ'
  },
  rosterControl: {
    en: 'Roster Control',
    hi: 'रोस्टर नियंत्रण',
    kn: 'ಪಟ್ಟಿ ನಿಯಂತ್ರಣ'
  },
  waiting: {
    en: 'waiting',
    hi: 'प्रतीक्षारत',
    kn: 'ಕಾಯುತ್ತಿದ್ದಾರೆ'
  },
  setAvailable: {
    en: 'Set Available',
    hi: 'उपलब्ध सेट करें',
    kn: 'ಲಭ್ಯವಿದೆ ಎಂದು ಹೊಂದಿಸಿ'
  },
  setOnDuty: {
    en: 'Set On Duty',
    hi: 'ड्यूटी पर सेट करें',
    kn: 'ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ ಎಂದು ಹೊಂದಿಸಿ'
  },
  setInConsult: {
    en: 'Set In Consult',
    hi: 'परामर्श में सेट करें',
    kn: 'ಸಮಾಲೋಚನೆಯಲ್ಲಿದ್ದಾರೆ ಎಂದು ಹೊಂದಿಸಿ'
  },
  setOnLeave: {
    en: 'Set On Leave',
    hi: 'छुट्टी पर सेट करें',
    kn: 'ರಜೆಯಲ್ಲಿದ್ದಾರೆ ಎಂದು ಹೊಂದಿಸಿ'
  },
  refreshRoster: {
    en: 'Refresh Roster',
    hi: 'रोस्टर रीफ्रेश करें',
    kn: 'ಪಟ್ಟಿಯನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ'
  },
  orderCompletionDescription: {
    en: 'Verified completion rate from',
    hi: 'सत्यापित पूर्णता दर',
    kn: 'ಪರಿಶೀಲಿಸಿದ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ ದರ'
  },
  ordersInPeriodSuffix: {
    en: 'orders in the selected period.',
    hi: 'चयनित अवधि के आदेश।',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯ ಆದೇಶಗಳು.'
  },
  completedVerifiedDescription: {
    en: 'Orders completed or verified in the selected period.',
    hi: 'चयनित अवधि में पूर्ण या सत्यापित आदेश।',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯಲ್ಲಿ ಪೂರ್ಣಗೊಂಡ ಅಥವಾ ಪರಿಶೀಲಿಸಿದ ಆದೇಶಗಳು.'
  },
  invoicesInPeriod: {
    en: 'invoices in the selected period.',
    hi: 'चयनित अवधि के चालान।',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಯ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು.'
  },
  criticalLowStockDescription: {
    en: 'Reagents currently marked critical or low stock.',
    hi: 'वर्तमान में गंभीर या कम स्टॉक के रूप में चिह्नित अभिकर्मक।',
    kn: 'ಪ್ರಸ್ತುತ ಗಂಭೀರ ಅಥವಾ ಕಡಿಮೆ ದಾಸ್ತಾನು ಎಂದು ಗುರುತಿಸಲಾದ ರೀಜೆಂಟ್‌ಗಳು.'
  },
  analyzerFleetUptime: {
    en: 'Analyzer Fleet Uptime',
    hi: 'विश्लेषक बेड़े का अपटाइम',
    kn: 'ವಿಶ್ಲೇಷಕ ಬಳಗದ ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ'
  },
  load: {
    en: 'Load',
    hi: 'लोड',
    kn: 'ಲೋಡ್'
  },
  expiryWasteReduction: {
    en: 'Expiry Waste Reduction',
    hi: 'समाप्ति अपशिष्ट में कमी',
    kn: 'ಅವಧಿ ಮೀರಿದ ತ್ಯಾಜ್ಯ ಕಡಿತ'
  },
  technicianWorkloadBalance: {
    en: 'Technician Workload Balance',
    hi: 'तकनीशियन कार्यभार संतुलन',
    kn: 'ತಂತ್ರಜ್ಞರ ಕೆಲಸದ ಸಮತೋಲನ'
  },
  verificationAccuracy: {
    en: 'Verification Accuracy',
    hi: 'सत्यापन सटीकता',
    kn: 'ಪರಿಶೀಲನೆಯ ನಿಖರತೆ'
  },
  zeroFalseReleases: {
    en: 'Zero False Releases',
    hi: 'कोई गलत रिलीज़ नहीं',
    kn: 'ತಪ್ಪಾದ ಬಿಡುಗಡೆಗಳಿಲ್ಲ'
  },
  dispensingVelocity: {
    en: 'Dispensing Velocity',
    hi: 'दवा वितरण गति',
    kn: 'ಔಷಧ ವಿತರಣೆಯ ವೇಗ'
  },
  digitalReporting: {
    en: 'Digital Reporting',
    hi: 'डिजिटल रिपोर्टिंग',
    kn: 'ಡಿಜಿಟಲ್ ವರದಿ'
  },
  departmentName: {
    en: 'Laboratory Department',
    hi: 'प्रयोगशाला विभाग',
    kn: 'ಪ್ರಯೋಗಾಲಯ ವಿಭಾಗ'
  },
  biochemistry: {
    en: 'Biochemistry',
    hi: 'जैव रसायन',
    kn: 'ಜೀವರಸಾಯನಶಾಸ್ತ್ರ'
  },
  hematology: {
    en: 'Hematology',
    hi: 'रक्त विज्ञान',
    kn: 'ರಕ್ತವಿಜ್ಞಾನ'
  },
  immunology: {
    en: 'Immunology',
    hi: 'प्रतिरक्षा विज्ञान',
    kn: 'ರೋಗನಿರೋಧಕ ಶಾಸ್ತ್ರ'
  },
  microbiology: {
    en: 'Microbiology',
    hi: 'सूक्ष्म जीव विज्ञान',
    kn: 'ಸೂಕ್ಷ್ಮಜೀವಶಾಸ್ತ್ರ'
  },
  clinicalPathology: {
    en: 'Clinical Pathology',
    hi: 'नैदानिक विकृति विज्ञान',
    kn: 'ವೈದ್ಯಕೀಯ ರೋಗಶಾಸ್ತ್ರ'
  },
  appointmentToken: {
    en: 'Token #',
    hi: 'टोकन #',
    kn: 'ಟೋಕನ್ #'
  },
  regularOpd: {
    en: 'REGULAR OPD',
    hi: 'नियमित ओपीडी',
    kn: 'ನಿಯಮಿತ ಒಪಿಡಿ'
  },
  followUp: {
    en: 'FOLLOW UP',
    hi: 'फॉलो-अप',
    kn: 'ಮರುಭೇಟಿ'
  },
  specialistReview: {
    en: 'SPECIALIST REVIEW',
    hi: 'विशेषज्ञ समीक्षा',
    kn: 'ತಜ್ಞರ ಪರಿಶೀಲನೆ'
  },
  urgentConsult: {
    en: 'URGENT CONSULT',
    hi: 'तत्काल परामर्श',
    kn: 'ತುರ್ತು ಸಮಾಲೋಚನೆ'
  },
  impactGovernanceStatement: {
    en: 'By processing laboratory datasets within the hospital’s private runtime instead of transmitting clinical data to external services, the hospital protects patient data while improving clinical turnaround and reducing reagent stockouts.',
    hi: 'नैदानिक डेटा को बाहरी सेवाओं पर भेजने के बजाय अस्पताल के निजी सिस्टम में प्रयोगशाला डेटा संसाधित करके, अस्पताल मरीजों के डेटा की सुरक्षा करता है और नैदानिक प्रक्रिया में सुधार तथा अभिकर्मक की कमी को कम करता है।',
    kn: 'ವೈದ್ಯಕೀಯ ಡೇಟಾವನ್ನು ಬಾಹ್ಯ ಸೇವೆಗಳಿಗೆ ಕಳುಹಿಸುವ ಬದಲು ಆಸ್ಪತ್ರೆಯ ಖಾಸಗಿ ವ್ಯವಸ್ಥೆಯಲ್ಲೇ ಪ್ರಯೋಗಾಲಯದ ಡೇಟಾವನ್ನು ಸಂಸ್ಕರಿಸುವ ಮೂಲಕ, ಆಸ್ಪತ್ರೆಯು ರೋಗಿಗಳ ಡೇಟಾವನ್ನು ರಕ್ಷಿಸಿ ವೈದ್ಯಕೀಯ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ ಮತ್ತು ರೀಜೆಂಟ್ ಕೊರತೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.'
  },
  activeOrders: {
    en: 'Active Orders',
    hi: 'सक्रिय आदेश',
    kn: 'ಸಕ್ರಿಯ ಆದೇಶಗಳು'
  },
  verifiedCompletionRate: {
    en: 'Verified Completion Rate',
    hi: 'सत्यापित पूर्णता दर',
    kn: 'ಪರಿಶೀಲಿಸಿದ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ ದರ'
  },
  averageTurnaround: {
    en: 'Average Turnaround',
    hi: 'औसत टर्नअराउंड',
    kn: 'ಸರಾಸರಿ ಪೂರ್ಣಗೊಳಿಸುವ ಸಮಯ'
  },
  efficiencyScore: {
    en: 'Efficiency Score',
    hi: 'दक्षता स्कोर',
    kn: 'ದಕ್ಷತೆ ಅಂಕ'
  },
  optimized: {
    en: 'Optimized',
    hi: 'अनुकूलित',
    kn: 'ಅತ್ಯುತ್ತಮಗೊಳಿಸಲಾಗಿದೆ'
  },
  sovereigntyImpactValidation: {
    en: 'Sovereign Hospital Infrastructure Impact Validation',
    hi: 'संप्रभु अस्पताल अवसंरचना प्रभाव सत्यापन',
    kn: 'ಸ್ವಾಯತ್ತ ಆಸ್ಪತ್ರೆ ಮೂಲಸೌಕರ್ಯ ಪರಿಣಾಮ ಪರಿಶೀಲನೆ'
  },
  zeroOutages: {
    en: 'Zero Outages',
    hi: 'कोई सेवा बाधित नहीं',
    kn: 'ಯಾವುದೇ ಸೇವಾ ವ್ಯತ್ಯಯವಿಲ್ಲ'
  },
  uptime: {
    en: 'Uptime',
    hi: 'अपटाइम',
    kn: 'ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ'
  },
  loss: {
    en: 'Loss',
    hi: 'हानि',
    kn: 'ನಷ್ಟ'
  },
  waste: {
    en: 'Waste',
    hi: 'अपशिष्ट',
    kn: 'ತ್ಯಾಜ್ಯ'
  },
  overtime: {
    en: 'Overtime',
    hi: 'ओवरटाइम',
    kn: 'ಹೆಚ್ಚುವರಿ ಕೆಲಸದ ಸಮಯ'
  },
  averageShort: {
    en: 'Avg',
    hi: 'औसत',
    kn: 'ಸರಾಸರಿ'
  },
  deliveries: {
    en: 'Deliveries',
    hi: 'डिलीवरी',
    kn: 'ವಿತರಣೆಗಳು'
  },
  paperless: {
    en: 'Paperless',
    hi: 'काग़ज़ रहित',
    kn: 'ಕಾಗದರಹಿತ'
  },
  sheetsPerDay: {
    en: 'Sheets / Day',
    hi: 'शीट / दिन',
    kn: 'ಹಾಳೆಗಳು / ದಿನ'
  },
  invoices: {
    en: 'invoices',
    hi: 'चालान',
    kn: 'ಇನ್‌ವಾಯ್ಸ್‌ಗಳು'
  },
  worklistItems: {
    en: 'worklist items',
    hi: 'कार्यसूची आइटम',
    kn: 'ಕೆಲಸದ ಪಟ್ಟಿಯ ಐಟಂಗಳು'
  },
  telemetryFeed: {
    en: 'Telemetry Feed',
    hi: 'टेलीमेट्री फ़ीड',
    kn: 'ಟೆಲಿಮೆಟ್ರಿ ಫೀಡ್'
  },
  statusLabel: {
    en: 'Status',
    hi: 'स्थिति',
    kn: 'ಸ್ಥಿತಿ'
  },
  selectedPeriodDay: {
    en: 'day',
    hi: 'दिन',
    kn: 'ದಿನ'
  },
  selectedPeriodDays: {
    en: 'day period',
    hi: 'दिन की अवधि',
    kn: 'ದಿನಗಳ ಅವಧಿ'
  },
  liveDepartmentEfficiency: {
    en: 'Live efficiency and completion rate across laboratories for the selected',
    hi: 'चयनित अवधि के लिए प्रयोगशालाओं में लाइव दक्षता और पूर्णता दर',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಗೆ ಪ್ರಯೋಗಾಲಯಗಳ ನೈಜ-ಸಮಯದ ದಕ್ಷತೆ ಮತ್ತು ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ ದರ'
  },
  impactPredictiveCalibration: {
    en: 'Predictive calibration schedules avoided thermal stress on the analyzers.',
    hi: 'पूर्वानुमानित कैलिब्रेशन शेड्यूल ने विश्लेषकों पर तापीय दबाव से बचाया।',
    kn: 'ಮುನ್ಸೂಚಕ ಕ್ಯಾಲಿಬ್ರೇಷನ್ ವೇಳಾಪಟ್ಟಿಗಳು ವಿಶ್ಲೇಷಕಗಳ ಮೇಲಿನ ಉಷ್ಣ ಒತ್ತಡವನ್ನು ತಪ್ಪಿಸಿದವು.'
  },
  impactFifoRotation: {
    en: 'FIFO lot rotation alerts minimized discard of unexpired reagents.',
    hi: 'FIFO बैच रोटेशन अलर्ट ने वैध अभिकर्मकों को फेंकने की मात्रा कम की।',
    kn: 'FIFO ಬ್ಯಾಚ್ ತಿರುಗುವಿಕೆ ಎಚ್ಚರಿಕೆಗಳು ಅವಧಿ ಮೀರದ ರೀಜೆಂಟ್‌ಗಳನ್ನು ತ್ಯಜಿಸುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿವೆ.'
  },
  impactShiftBalance: {
    en: 'Dynamic shift rebalancing prevented evening sample backlogs.',
    hi: 'गतिशील शिफ्ट पुनर्संतुलन ने शाम के नमूना बैकलॉग रोके।',
    kn: 'ಚಲನೆಯ ಶಿಫ್ಟ್ ಮರುಸಮತೋಲನವು ಸಂಜೆ ಮಾದರಿ ಬಾಕಿಯನ್ನು ತಡೆಯಿತು.'
  },
  impactDeltaChecks: {
    en: 'Delta checks and reference-range validation caught anomalous critical values before release.',
    hi: 'डेल्टा जाँच और संदर्भ-सीमा सत्यापन ने रिलीज़ से पहले असामान्य गंभीर मान पकड़े।',
    kn: 'ಡೆಲ್ಟಾ ಪರಿಶೀಲನೆ ಮತ್ತು ಉಲ್ಲೇಖ ಮಿತಿ ದೃಢೀಕರಣವು ಬಿಡುಗಡೆಗೂ ಮೊದಲು ಅಸಾಮಾನ್ಯ ಗಂಭೀರ ಮೌಲ್ಯಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿತು.'
  },
  impactPrescriptionSync: {
    en: 'Direct OPD prescription syncing to the pharmacy queue reduced patient counter wait times.',
    hi: 'ओपीडी नुस्खों को सीधे फार्मेसी कतार से जोड़ने पर मरीजों का प्रतीक्षा समय कम हुआ।',
    kn: 'ಒಪಿಡಿ ಔಷಧ ಚೀಟಿಗಳನ್ನು ನೇರವಾಗಿ ಫಾರ್ಮಸಿ ಸರದಿಗೆ ಜೋಡಿಸುವುದರಿಂದ ರೋಗಿಗಳ ಕಾಯುವ ಸಮಯ ಕಡಿಮೆಯಾಯಿತು.'
  },
  impactPortalDelivery: {
    en: 'Patient portal delivery reduced printing and courier costs.',
    hi: 'रोगी पोर्टल डिलीवरी से प्रिंटिंग और कूरियर लागत कम हुई।',
    kn: 'ರೋಗಿ ಪೋರ್ಟಲ್ ವಿತರಣೆಯಿಂದ ಮುದ್ರಣ ಮತ್ತು ಕೊರಿಯರ್ ವೆಚ್ಚ ಕಡಿಮೆಯಾಯಿತು.'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('labguard_lang');
      return (saved === 'hi' || saved === 'kn') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('labguard_lang', lang);
    } catch {
      // safe fallback
    }
  };

  const t = useMemo(() => {
    return (key: string): string => {
      if (!key) return '';
      const item = translations[key];
      if (item && item[language]) return item[language];
      if (item && item.en) return item.en;

      // Handle dot notation e.g. "nav.dashboard" -> "Dashboard"
      const leaf = key.includes('.') ? key.split('.').pop() || key : key;
      const formatted = leaf
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      return formatted || key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t('language')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        aria-label={t('language')}
        className="rounded-lg border border-slate-400/40 bg-transparent px-2.5 py-1.5 text-xs font-semibold"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>
    </label>
  );
}
