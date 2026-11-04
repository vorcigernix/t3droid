export interface Preview {
  title: string;
  fetchedAt: number;
  description?: string;
  favicon?: string;
}

export interface Link {
  code: string;
  url: string;
  createdAt: number;
  preview?: Preview;
  clicks: number;
  isUnfurling?: boolean;
}

export interface ClickEvent {
  id: string;
  code: string;
  url: string;
  at: number;
  referrer: string;
  browser: string;
  device: string;
}

export interface RouteMetric {
  route: string;
  count: number;
  avgLatencyMs: number;
}
