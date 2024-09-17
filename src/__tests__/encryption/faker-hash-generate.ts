import { HashGenerator } from "@/application/encryption/hash-generator"

export class FakerHashGenerate implements HashGenerator {
  async generate(plainText: string): Promise<string> {
    return plainText.concat("-hashed")
  }
}
