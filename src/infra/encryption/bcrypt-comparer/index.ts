import bcrypt from "bcryptjs"

import { HashComparer } from "@/application/encryption/hash-comparer"

export class BcryptComparer implements HashComparer {
  async compare(plainText: string, cypherText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, cypherText)
  }
}
