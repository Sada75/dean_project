import apiSpec from "./api-spec.json"

export type ApiEndpoint = {
  name: string
  method: string
  path: string
  requiresAuth: boolean
}

export function getApiEndpoints(): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = []

  // Recursively extract endpoints from the API spec
  function extractEndpoints(items: any[]) {
    items.forEach((item) => {
      if (item.item) {
        extractEndpoints(item.item)
      } else if (item.request) {
        endpoints.push({
          name: item.name,
          method: item.request.method,
          path: item.request.url.raw.replace(/{{base_url}}/, ""),
          requiresAuth: item.request.header?.some((h: any) => h.key === "Authorization") || false,
        })
      }
    })
  }

  extractEndpoints(apiSpec.item)
  return endpoints
}

export function getApiBaseUrl(): string {
  const baseUrlVar = apiSpec.variable.find((v) => v.key === "base_url")
  return baseUrlVar ? baseUrlVar.value : "http://localhost:3000"
}

