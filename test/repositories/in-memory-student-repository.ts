import { StudentsRepository } from '#/domain/forum/application/repositories/students-repository.js'
import { Student } from '#/domain/forum/enterprise/entities/student.js'

export class InMemoryStudentRepository implements StudentsRepository {
	public items: Student[] = []

	async create(student: Student) {
		this.items.push(student)
	}

	async findByEmail(email: string) {
		const student = this.items.find((item) => item.email === email)

		if (!student) {
			return null
		}

		return student
	}
}
