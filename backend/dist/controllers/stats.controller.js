"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = exports.getStats = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get statistics (Admin only)
const getStats = async (req, res) => {
    try {
        // Count inferred marriages from shared children
        const sharedChildrenParents = await prisma_1.default.person.groupBy({
            by: ['fatherId', 'motherId'],
            where: {
                AND: [
                    { fatherId: { not: null } },
                    { motherId: { not: null } }
                ]
            }
        });
        const totalMarriages = sharedChildrenParents.length;
        const [totalPersons, maleCount, femaleCount, totalUsers, livingCount, deceasedCount] = await Promise.all([
            prisma_1.default.person.count(),
            prisma_1.default.person.count({ where: { gender: 'MALE' } }),
            prisma_1.default.person.count({ where: { gender: 'FEMALE' } }),
            prisma_1.default.user.count(),
            prisma_1.default.person.count({ where: { deathDate: null } }),
            prisma_1.default.person.count({ where: { deathDate: { not: null } } })
        ]);
        // Get generation count (people without parents are Gen 1)
        const rootPersons = await prisma_1.default.person.findMany({
            where: { fatherId: null, motherId: null },
            select: { id: true }
        });
        // Calculate approximate generations
        let maxGeneration = 1;
        const calculateGeneration = async (personId, currentGen) => {
            const children = await prisma_1.default.person.findMany({
                where: { OR: [{ fatherId: personId }, { motherId: personId }] },
                select: { id: true }
            });
            if (children.length === 0)
                return currentGen;
            const childGens = await Promise.all(children.map(child => calculateGeneration(child.id, currentGen + 1)));
            return Math.max(...childGens);
        };
        for (const root of rootPersons.slice(0, 5)) { // Limit to avoid timeout
            const gen = await calculateGeneration(root.id, 1);
            maxGeneration = Math.max(maxGeneration, gen);
        }
        // Recent additions
        const recentPersons = await prisma_1.default.person.findMany({
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
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil statistik.' });
    }
};
exports.getStats = getStats;
// Get public stats (for viewers)
const getPublicStats = async (req, res) => {
    try {
        const sharedChildrenParents = await prisma_1.default.person.groupBy({
            by: ['fatherId', 'motherId'],
            where: {
                AND: [
                    { fatherId: { not: null } },
                    { motherId: { not: null } }
                ]
            }
        });
        const [totalPersons] = await Promise.all([
            prisma_1.default.person.count()
        ]);
        res.json({
            totalPersons,
            totalMarriages: sharedChildrenParents.length
        });
    }
    catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan.' });
    }
};
exports.getPublicStats = getPublicStats;
//# sourceMappingURL=stats.controller.js.map