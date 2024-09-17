import { HashComparer } from "@/application/encryption/hash-comparer"

export class FakerHashComparer implements HashComparer {
  async compare(plainText: string, cypherText: string): Promise<boolean> {
    return plainText === cypherText
  }
}
