import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import { Student } from '#/domain/forum/enterprise/entities/student.js'
import { Prisma, User as PrismaUser } from '../config/generated/client.js'

export class PrismaStudentMapper {
	static toDomain(raw: PrismaUser): Student {
		return Student.create(
			{
				email: raw.email,
				name: raw.name,
				password: raw.password,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(students: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: students.id.toString(),
			name: students.name,
			email: students.email,
			password: students.password,
			createdAt: students.createdAt,
			updatedAt: students.updatedAt,
		}
	}
}
