import { DrizzleTasksRepository } from "@/infra/database/drizzle/repositories/drizzle-tasks-repository"
import { DrizzleUsersRepository } from "@/infra/database/drizzle/repositories/drizzle-users-repository"

const DatabaseUsersRepository = DrizzleUsersRepository
const DatabaseTasksRepository = DrizzleTasksRepository

export { DatabaseUsersRepository, DatabaseTasksRepository }
