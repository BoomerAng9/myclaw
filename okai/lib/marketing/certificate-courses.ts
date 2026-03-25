export type CertificateCourse = {
  title: string;
  provider: string;
  credentialType: string;
  href: string;
  summary: string;
};

export type CatalogCount = {
  title: string;
  courses: number;
  certificates?: number;
  bundles?: number;
};

export type ContentPartner = CatalogCount;

export const learningCategories: CatalogCount[] = [
  { title: 'Agile', courses: 3, certificates: 2 },
  { title: 'Banking', courses: 4, certificates: 1 },
  { title: 'Business Analysis', courses: 1 },
  { title: 'Business Math', courses: 3 },
  { title: 'Career Building', courses: 6, bundles: 1 },
  { title: 'Change Management', courses: 4, certificates: 1 },
  { title: 'Communication', courses: 12, certificates: 2 },
  { title: 'Computer Applications', courses: 13 },
  { title: 'Creativity & Innovation', courses: 4, certificates: 1 },
  { title: 'Cybersecurity & CISSP', courses: 27, certificates: 2, bundles: 1 },
  { title: 'Data Analytics', courses: 0, certificates: 1 },
  { title: 'Design', courses: 4, certificates: 1 },
  { title: 'Emergency Management', courses: 2 },
  { title: 'Entrepreneurship', courses: 6, certificates: 2 },
  { title: 'Finance', courses: 6, certificates: 1 },
  { title: 'HR Management', courses: 87, certificates: 15, bundles: 4 },
  { title: 'International Trade', courses: 4, bundles: 1 },
  { title: 'Leadership', courses: 5, certificates: 2 },
  { title: 'LEED Green Building', courses: 1 },
  { title: 'Management', courses: 36, certificates: 6 },
  { title: 'Marketing', courses: 14, certificates: 2, bundles: 1 },
  { title: 'Nonprofit Management', courses: 33, certificates: 4 },
  { title: 'Online Learning', courses: 5 },
  { title: 'Operations', courses: 4 },
  { title: 'Personal Enrichment', courses: 9 },
  { title: 'Project Management', courses: 30, certificates: 1, bundles: 3 },
  { title: 'Remote Work', courses: 3, bundles: 1 },
  { title: 'Security Awareness', courses: 1 },
  { title: 'Six Sigma & Lean', courses: 10, bundles: 4 },
  { title: 'Small Business Management', courses: 8, certificates: 2 },
  { title: 'Women in Business', courses: 7, certificates: 2 },
];

export const contentPartners: ContentPartner[] = [
  { title: 'AARP', courses: 1 },
  { title: 'Acuity Institute', courses: 2 },
  { title: 'AIGA', courses: 4, certificates: 1 },
  { title: 'CFTEA', courses: 4, certificates: 1 },
  { title: 'Frontline Manager', courses: 20, certificates: 3 },
  { title: 'HRCI', courses: 53, certificates: 11, bundles: 4 },
  { title: 'HR Skills', courses: 16, certificates: 2 },
  { title: 'MindEdge Studio', courses: 4 },
  { title: 'Nonprofit Skills', courses: 17, certificates: 3 },
  { title: 'PM Skills', courses: 17 },
  { title: 'Skye Learning', courses: 15, certificates: 4 },
];

export const certificateCourses: CertificateCourse[] = [
  {
    title: 'Acuity Institute Lean Six Sigma Black Belt Certification',
    provider: 'Acuity Institute',
    credentialType: 'Certification',
    href: 'https://catalog.mindedge.com/achievemor/courses/4644d2ac-7733-44a7-a9e6-0269ab912362/acuity-institutes-lean-six-sigma-black-belt-certification',
    summary: 'Advanced Lean Six Sigma credential for process improvement, operations rigor, and enterprise change leadership.',
  },
  {
    title: 'AIGA Professional Design Certificate (ACE CREDIT)',
    provider: 'AIGA',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/183a0229-f15c-496a-843f-c866d41a5d71/aiga-professional-design-certificate-ace-credit',
    summary: 'Professional design certificate covering foundations, business context, and standards of practice.',
  },
  {
    title: 'CFTEA: Online Certified Modern Banking Representative Certificate',
    provider: 'CFTEA',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/bc6880b6-a3e6-40eb-9442-a7790ebdc6b5/cftea-online-certified-modern-banking-representative-certificate',
    summary: 'Banking credential focused on modern customer service, legal foundations, and representative readiness.',
  },
  {
    title: 'Frontline Manager Certificate',
    provider: 'Frontline Manager',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/161717ec-e066-45f4-8c0d-b93d6344f68e/frontline-manager-certificate',
    summary: 'Supervisor-focused certificate for communication, coaching, leadership, and team management.',
  },
  {
    title: 'Frontline Manager (ACE CREDIT)',
    provider: 'Frontline Manager',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/69ff32ad-3bc5-4e64-8ec8-657f57498e71/frontline-manager-ace-credit',
    summary: 'ACE-credit-backed frontline leadership pathway for new and developing managers.',
  },
  {
    title: 'HRCI Pro: AI for HR Certificate',
    provider: 'HRCI',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/019a6fd3-33f5-7178-a44e-afebcbfab0c3/hrci-pro-ai-for-hr-certificate',
    summary: 'AI-focused HR certificate centered on workforce strategy, employee experience, and responsible adoption.',
  },
  {
    title: 'HRCI: HR Ethics Certificate',
    provider: 'HRCI',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/09591de4-5714-4d3f-a2a2-ca25b42367ee/hrci-hr-ethics-certificate',
    summary: 'Ethics-centered HR certificate covering compliant decisions, workplace standards, and responsible leadership.',
  },
  {
    title: 'HR Skills Fundamentals Certificate',
    provider: 'HR Skills',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/e6e31da1-571d-42b5-9e73-7d1be7247018/hr-skills-fundamentals-certificate',
    summary: 'Foundational HR certificate for communication, onboarding, interviewing, and talent support.',
  },
  {
    title: 'HR Skills Best Practices Certificate',
    provider: 'HR Skills',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/6d7a7789-60e7-4f95-8946-018c5bd8c95c/hr-skills-best-practices-certificate',
    summary: 'Best-practice HR certificate focused on practical workplace management and people operations.',
  },
  {
    title: 'Nonprofit Skills: Board Fundamentals Certificate',
    provider: 'Nonprofit Skills',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/e0f76f33-36b5-4e7e-b67b-e8a763667f85/nonprofit-skills-board-fundamentals-certificate',
    summary: 'Board leadership certificate for governance, oversight, fundraising, and strategic communication.',
  },
  {
    title: 'Certificate in Leadership for Women in Business',
    provider: 'Skye Learning',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/d6c378b2-4d7f-49f2-a441-504e95d652a3/certificate-in-leadership-for-women-in-business',
    summary: 'Leadership certificate built around communication, negotiation, mentorship, and executive growth.',
  },
  {
    title: 'Certificate in Small Business Management',
    provider: 'Skye Learning',
    credentialType: 'Certificate',
    href: 'https://catalog.mindedge.com/achievemor/suites/b7ad1e0c-a54d-4780-8d1b-ad9d2dd4589b/certificate-in-small-business-management',
    summary: 'Small-business management certificate spanning finance, HR, operations, and project leadership.',
  },
];