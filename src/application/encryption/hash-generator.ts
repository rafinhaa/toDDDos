export interface HashGenerator {
  generate: (plainText: string) => Promise<string>
}
