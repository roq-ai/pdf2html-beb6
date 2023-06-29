const mapping: Record<string, string> = {
  businesses: 'business',
  htmls: 'html',
  pdfs: 'pdf',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
