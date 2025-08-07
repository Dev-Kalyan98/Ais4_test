
import { Course, CourseType } from './types';

export const FUNCTIONAL_COURSES: Course[] = [
  { name: 'SAP S/4HANA Financial Accounting (FI/CO)', type: CourseType.Functional, description: 'Master financial management and controlling in the S/4HANA landscape.' },
  { name: 'SAP S/4HANA Materials Management (MM)', type: CourseType.Functional, description: 'Learn procurement, inventory, and logistics processes with SAP MM.' },
  { name: 'SAP S/4HANA Sales & Distribution (SD)', type: CourseType.Functional, description: 'Covering the complete sales cycle from order to cash.' },
  { name: 'SAP S/4HANA Production Planning (PP)', type: CourseType.Functional, description: 'Understand manufacturing processes and planning in S/4HANA.' },
  { name: 'SAP S/4HANA Human Capital Management (HCM)', type: CourseType.Functional, description: 'Manage your workforce with core HR processes in S/4HANA.' },
  { name: 'SAP S/4HANA Project Systems (PS)', type: CourseType.Functional, description: 'Oversee project lifecycles from planning to completion.' },
  { name: 'SAP S/4HANA Asset Management (EAM)', type: CourseType.Functional, description: 'Optimize asset performance and maintenance strategies.' },
  { name: 'SAP SuccessFactors Employee Central', type: CourseType.Functional, description: 'The core of your HR suite in the cloud.' },
  { name: 'SAP Ariba Strategic Sourcing', type: CourseType.Functional, description: 'Transform your sourcing and procurement with SAP Ariba.' },
  { name: 'SAP Integrated Business Planning (IBP)', type: CourseType.Functional, description: 'Drive better business decisions with real-time supply chain planning.' },
];

export const TECHNICAL_COURSES: Course[] = [
  { name: 'SAP ABAP for S/4HANA (RAP, CDS, BOPF)', type: CourseType.Technical, description: 'Modern ABAP development for the S/4HANA world.' },
  { name: 'SAP Fiori/UI5 Development', type: CourseType.Technical, description: 'Build intuitive and responsive user experiences with SAPUI5.' },
  { name: 'SAP Business Technology Platform (BTP) – Extension Suite', type: CourseType.Technical, description: 'Extend SAP applications and build new ones on BTP.' },
  { name: 'SAP Integration Suite (CPI)', type: CourseType.Technical, description: 'Master cloud-based integration scenarios with CPI.' },
  { name: 'SAP Cloud ALM & Solution Manager 7.2', type: CourseType.Technical, description: 'Learn application lifecycle management for cloud and hybrid solutions.' },
  { name: 'SAP Basis & SAP HANA Administration', type: CourseType.Technical, description: 'Administer and maintain robust SAP landscapes.' },
  { name: 'SAP CAP & Node.js on BTP', type: CourseType.Technical, description: 'Develop full-stack applications on BTP using the Cloud Application Programming Model.' },
  { name: 'SAP Analytics Cloud (SAC) Design & Storyboarding', type: CourseType.Technical, description: 'Create powerful data visualizations and analytics stories.' },
  { name: 'SAP Process Automation (BPA)', type: CourseType.Technical, description: 'Automate business processes with robotic process automation and workflows.' },
  { name: 'SAP Datasphere (DW Cloud)', type: CourseType.Technical, description: 'Unify your data landscape with SAP\'s data warehouse cloud solution.' },
];

export const INITIAL_COURSES: Course[] = [...FUNCTIONAL_COURSES, ...TECHNICAL_COURSES];