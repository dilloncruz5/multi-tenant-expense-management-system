import prisma from '../prisma/client';
import { Prisma, User } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createOrganizationAndUser(
    orgData: Prisma.OrganizationCreateInput,
    userData: Omit<Prisma.UserUncheckedCreateInput, 'orgId'>
  ) {
    return prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({ data: orgData });
      const user = await tx.user.create({
        data: {
          ...userData,
          orgId: org.id,
          role: 'ADMIN', // first user is ADMIN
        },
      });
      return { org, user };
    });
  }
}

export const userRepository = new UserRepository();
