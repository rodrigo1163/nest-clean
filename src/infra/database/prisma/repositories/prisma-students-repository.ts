import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { StudentsRepository } from '#/domain/forum/application/repositories/students-repository.js'
import { Student } from '#/domain/forum/enterprise/entities/student.js'
import { PrismaStudentMapper } from '../mappers/prisma-students-mapper.js'

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'STUDENT',
      }
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }
  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({ data })
  }

}
