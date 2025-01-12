import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * 
 * @param userId - User Id
 * @returns {boolean} True if user has permission to perform admin actions
 */
export async function canSeeAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      admin: true
    }
  })

  if (user === null) {
    return false;
  }
  return user.admin;
}