import bcrypt from "bcryptjs"

import { HashGenerator } from "@/application/encryption/hash-generator"

const SALT = 6

export class BcryptGenerate implements HashGenerator {
  async generate(plainText: string): Promise<string> {
    const hash = await bcrypt.hash(plainText, SALT)
    return hash
  }
}
