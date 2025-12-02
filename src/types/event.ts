export type Event = {
  id: string;
  name: string;
  dateRange: string;
  time: string;
  neighborhood: string;
  location: string;
  type: string;
  producer?: string;
  sponsors?: string;
  access?: string;
  cost?: string;
  rsvpLink?: string;
  infoLink?: string;
  officialLink?: string;
  notes?: string;
  tonightFeatured?: boolean;
  curatorPickScore?: number;
};
