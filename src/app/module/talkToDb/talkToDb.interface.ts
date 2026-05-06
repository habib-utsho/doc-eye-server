export type TLlmResponse = {
  collection: string
  filter: Record<string, unknown>
  summary: string
  populate?: {
    path: string
    select?: string
  }[]
}
