import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get statistics (Admin only)
export const getStats = async (req: Request, res: Response) => {
  try {
    // Count inferred marriages from shared children
    const sharedChildrenParents = await prisma.person.groupBy({
      by: ['fatherId', 'motherId'],
      where: {
        AND: [
          { fatherId: { not: null } },
          { motherId: { not: null } }
        ]
      }
    });

    const totalMarriages = sharedChildrenParents.length;

    const [
      totalPersons,
      maleCount,
      femaleCount,
      totalUsers,
      livingCount,
      deceasedCount
    ] = await Promise.all([
      prisma.person.count(),
      prisma.person.count({ where: { gender: 'MALE' } }),
      prisma.person.count({ where: { gender: 'FEMALE' } }),
      prisma.user.count(),
      prisma.person.count({ where: { deathDate: null } }),
      prisma.person.count({ where: { deathDate: { not: null } } })
    ]);

    // Get generation count (people without parents are Gen 1)
    const rootPersons = await prisma.person.findMany({
      where: { fatherId: null, motherId: null },
      select: { id: true }
    });

    // Calculate approximate generations
    let maxGeneration = 1;
    const calculateGeneration = async (personId: string, currentGen: number): Promise<number> => {
      const children = await prisma.person.findMany({
        where: { OR: [{ fatherId: personId }, { motherId: personId }] },
        select: { id: true }
      });
      
      if (children.length === 0) return currentGen;
      
      const childGens = await Promise.all(
        children.map(child => calculateGeneration(child.id, currentGen + 1))
      );
      
      return Math.max(...childGens);
    };

    for (const root of rootPersons.slice(0, 5)) { // Limit to avoid timeout
      const gen = await calculateGeneration(root.id, 1);
      maxGeneration = Math.max(maxGeneration, gen);
    }

    // Recent additions
    const recentPersons = await prisma.person.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, createdAt: true }
    });

    res.json({
      summary: {
        totalPersons,
        maleCount,
        femaleCount,
        totalMarriages,
        totalUsers,
        livingCount,
        deceasedCount,
        estimatedGenerations: maxGeneration
      },
      recentAdditions: recentPersons
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil statistik.' });
  }
};

// Get public stats (for viewers)
export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const sharedChildrenParents = await prisma.person.groupBy({
      by: ['fatherId', 'motherId'],
      where: {
        AND: [
          { fatherId: { not: null } },
          { motherId: { not: null } }
        ]
      }
    });

    const [totalPersons] = await Promise.all([
      prisma.person.count()
    ]);

    res.json({
      totalPersons,
      totalMarriages: sharedChildrenParents.length
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};
