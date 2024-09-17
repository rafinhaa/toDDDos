import { BcryptGenerate } from "@/infra/encryption/bcrypt-generate"

import { BcryptComparer } from "./bcrypt-comparer"

const HashGenerator = BcryptGenerate
const HashComparer = BcryptComparer

export { HashGenerator, HashComparer }
