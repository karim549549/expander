export interface TopVendor {
  vendorId: string;
  vendorName: string;
  averageScore: number;
}

export interface CountryAnalytics {
  country: string;
  topVendors: TopVendor[];
  researchDocumentsCount: number;
}

export interface ClientActivity {
  clientId: string;
  clientName: string;
  totalProjects: number;
  totalBudget: number;
  totalResearchDocuments: number;
}

export interface MostActiveProject {
  projectId: string;
  projectName: string; // Assuming Project entity has a name/title
  documentCount: number;
}
