import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { validationError } from '../utils/http';

type ParsedOptionalDate =
  | { ok: true; value: Date | null | undefined }
  | { ok: false; error: string };

type ParsedPersonDates =
  | { ok: true; birthDate: Date | null | undefined; deathDate: Date | null | undefined }
  | { ok: false; error: string };

const parsePersonDates = (birthDate: unknown, deathDate: unknown): ParsedPersonDates => {
  const parsedBirthDate = parseOptionalDateField(birthDate, 'Tanggal lahir');
  if (parsedBirthDate.ok === false) return { ok: false, error: parsedBirthDate.error };

  const parsedDeathDate = parseOptionalDateField(deathDate, 'Tanggal wafat');
  if (parsedDeathDate.ok === false) return { ok: false, error: parsedDeathDate.error };

  if (parsedBirthDate.value && parsedDeathDate.value && parsedDeathDate.value < parsedBirthDate.value) {
    return { ok: false as const, error: 'Tanggal wafat tidak boleh sebelum tanggal lahir.' };
  }

  return {
    ok: true as const,
    birthDate: parsedBirthDate.value,
    deathDate: parsedDeathDate.value
  };
};

const parseOptionalDateField = (value: unknown, fieldName: string): ParsedOptionalDate => {
  if (value === undefined) {
    return { ok: true as const, value: undefined };
  }

  if (value === null || value === '') {
    return { ok: true as const, value: null };
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return { ok: false as const, error: `${fieldName} harus berupa tanggal yang valid.` };
  }

  return { ok: true as const, value: date };
};

// Get all persons
export const getAllPersons = async (req: Request, res: Response) => {
  try {
    const { search, gender } = req.query;
    
    const where: any = {};
    
    if (search && typeof search === 'string') {
      where.OR = [
        { fullName: { contains: search } },
        { nickname: { contains: search } },
      ];
    }
    
    if (gender === 'MALE' || gender === 'FEMALE') {
      where.gender = gender;
    }

    const persons = await prisma.person.findMany({
      where,
      include: {
        father: { select: { id: true, fullName: true } },
        mother: { select: { id: true, fullName: true } },
        marriagesAsHusband: { 
          include: { wife: { select: { id: true, fullName: true } } } 
        },
        marriagesAsWife: { 
          include: { husband: { select: { id: true, fullName: true } } } 
        },
        _count: {
          select: { childrenAsFather: true, childrenAsMother: true, media: true }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    res.json(persons);
  } catch (error) {
    console.error('Get all persons error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
  }
};

// Get person by ID
export const getPersonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const person = await prisma.person.findUnique({
      where: { id: String(id) },
      include: {
        father: { select: { id: true, fullName: true, profilePhoto: true } },
        mother: { select: { id: true, fullName: true, profilePhoto: true } },
        childrenAsFather: { 
          select: { id: true, fullName: true, gender: true, birthDate: true, profilePhoto: true, motherId: true },
          orderBy: { birthDate: 'asc' }
        },
        childrenAsMother: { 
          select: { id: true, fullName: true, gender: true, birthDate: true, profilePhoto: true, fatherId: true },
          orderBy: { birthDate: 'asc' }
        },
        marriagesAsHusband: { 
          include: { wife: { select: { id: true, fullName: true, profilePhoto: true } } },
          orderBy: { orderNumber: 'asc' }
        },
        marriagesAsWife: { 
          include: { husband: { select: { id: true, fullName: true, profilePhoto: true } } },
          orderBy: { orderNumber: 'asc' }
        },
        media: { orderBy: { uploadedAt: 'desc' } }
      }
    });

    if (!person) {
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    // Combine children from both relations
    const children = person.gender === 'MALE' 
      ? person.childrenAsFather 
      : person.childrenAsMother;

    // Get formal spouses
    const formalSpouses = person.gender === 'MALE'
      ? person.marriagesAsHusband.map((m: any) => ({ 
          ...m.wife, 
          marriageDate: m.marriageDate, 
          marriageId: m.id,
          type: 'FORMAL'
        }))
      : person.marriagesAsWife.map((m: any) => ({ 
          ...m.husband, 
          marriageDate: m.marriageDate, 
          marriageId: m.id,
          type: 'FORMAL'
        }));

    // Get inferred spouses from children
    const inferredSpousesMap = new Map();
    
    if (person.gender === 'MALE') {
      for (const child of person.childrenAsFather) {
        if (child.motherId && !inferredSpousesMap.has(child.motherId)) {
          // Check if not already in formal spouses
          if (!formalSpouses.some((s: any) => s.id === child.motherId)) {
            const mother = await prisma.person.findUnique({
              where: { id: child.motherId },
              select: { id: true, fullName: true, profilePhoto: true }
            });
            if (mother) {
              inferredSpousesMap.set(child.motherId, { ...mother, type: 'INFERRED' });
            }
          }
        }
      }
    } else {
      for (const child of person.childrenAsMother) {
        if (child.fatherId && !inferredSpousesMap.has(child.fatherId)) {
          // Check if not already in formal spouses
          if (!formalSpouses.some((s: any) => s.id === child.fatherId)) {
            const father = await prisma.person.findUnique({
              where: { id: child.fatherId },
              select: { id: true, fullName: true, profilePhoto: true }
            });
            if (father) {
              inferredSpousesMap.set(child.fatherId, { ...father, type: 'INFERRED' });
            }
          }
        }
      }
    }

    const spouses = [...formalSpouses, ...Array.from(inferredSpousesMap.values())];

    res.json({
      ...person,
      children,
      spouses
    });
  } catch (error) {
    console.error('Get person by ID error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
  }
};

// Create person (Admin only)
export const createPerson = async (req: Request, res: Response) => {
  try {
    const { fullName, nickname, gender, birthDate, deathDate, birthPlace, occupation, biography, fatherId, motherId, profilePhoto } = req.body;

    if (!fullName || !gender) {
      return validationError(res, 'Nama lengkap dan jenis kelamin diperlukan.');
    }

    if (gender !== 'MALE' && gender !== 'FEMALE') {
      return validationError(res, 'Jenis kelamin harus MALE atau FEMALE.');
    }

    const parsedDates = parsePersonDates(birthDate, deathDate);
    if (parsedDates.ok === false) {
      return validationError(res, parsedDates.error);
    }

    // Validate parent IDs if provided
    if (fatherId) {
      const father = await prisma.person.findUnique({ where: { id: fatherId } });
      if (!father || father.gender !== 'MALE') {
        return validationError(res, 'Ayah tidak ditemukan atau bukan laki-laki.');
      }
    }

    if (motherId) {
      const mother = await prisma.person.findUnique({ where: { id: motherId } });
      if (!mother || mother.gender !== 'FEMALE') {
        return validationError(res, 'Ibu tidak ditemukan atau bukan perempuan.');
      }
    }

    const person = await prisma.person.create({
      data: {
        fullName,
        nickname,
        gender,
        birthDate: parsedDates.birthDate ?? null,
        deathDate: parsedDates.deathDate ?? null,
        birthPlace,
        occupation,
        biography,
        fatherId,
        motherId,
        profilePhoto,
      },
      include: {
        father: { select: { id: true, fullName: true } },
        mother: { select: { id: true, fullName: true } }
      }
    });

    res.status(201).json(person);
  } catch (error) {
    console.error('Create person error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat data.' });
  }
};

// Update person (Admin only)
export const updatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, nickname, gender, birthDate, deathDate, birthPlace, occupation, biography, fatherId, motherId, profilePhoto } = req.body;

    const existing = await prisma.person.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    if (gender !== undefined && gender !== 'MALE' && gender !== 'FEMALE') {
      return validationError(res, 'Jenis kelamin harus MALE atau FEMALE.');
    }

    const parsedDates = parsePersonDates(birthDate, deathDate);
    if (parsedDates.ok === false) {
      return validationError(res, parsedDates.error);
    }

    // Validate parent IDs if provided
    if (fatherId) {
      const father = await prisma.person.findUnique({ where: { id: fatherId } });
      if (!father || father.gender !== 'MALE') {
        return validationError(res, 'Ayah tidak ditemukan atau bukan laki-laki.');
      }
      if (fatherId === id) {
        return validationError(res, 'Tidak bisa menjadi ayah dari diri sendiri.');
      }
    }

    if (motherId) {
      const mother = await prisma.person.findUnique({ where: { id: motherId } });
      if (!mother || mother.gender !== 'FEMALE') {
        return validationError(res, 'Ibu tidak ditemukan atau bukan perempuan.');
      }
      if (motherId === id) {
        return validationError(res, 'Tidak bisa menjadi ibu dari diri sendiri.');
      }
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (gender !== undefined) updateData.gender = gender;
    if (birthDate !== undefined) updateData.birthDate = parsedDates.birthDate;
    if (deathDate !== undefined) updateData.deathDate = parsedDates.deathDate;
    if (birthPlace !== undefined) updateData.birthPlace = birthPlace;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (biography !== undefined) updateData.biography = biography;
    if (fatherId !== undefined) updateData.fatherId = fatherId;
    if (motherId !== undefined) updateData.motherId = motherId;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    const person = await prisma.person.update({
      where: { id: String(id) },
      data: updateData,
      include: {
        father: { select: { id: true, fullName: true } },
        mother: { select: { id: true, fullName: true } }
      }
    });

    res.json(person);
  } catch (error) {
    console.error('Update person error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data.' });
  }
};

// Delete person (Admin only)
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const personId = String(id);

    const existing = await prisma.person.findUnique({ 
      where: { id: personId },
      include: {
        _count: { select: { childrenAsFather: true, childrenAsMother: true } }
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    // Check if person has children
    if (existing._count.childrenAsFather > 0 || existing._count.childrenAsMother > 0) {
      return validationError(res, 'Tidak bisa menghapus anggota yang memiliki anak. Hapus hubungan anak terlebih dahulu.');
    }

    const linkedUser = await prisma.user.findUnique({ where: { personId } });
    if (linkedUser) {
      return validationError(res, 'Tidak bisa menghapus anggota yang masih terhubung dengan akun user.');
    }

    await prisma.$transaction([
      prisma.marriage.deleteMany({
        where: { OR: [{ husbandId: personId }, { wifeId: personId }] }
      }),
      prisma.person.delete({ where: { id: personId } })
    ]);

    res.json({ message: 'Anggota keluarga berhasil dihapus.' });
  } catch (error) {
    console.error('Delete person error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data.' });
  }
};

// Get family tree data
export const getFamilyTree = async (req: Request, res: Response) => {
  try {
    const persons = await prisma.person.findMany({
      include: {
        marriagesAsHusband: { select: { wifeId: true } },
        marriagesAsWife: { select: { husbandId: true } },
        childrenAsFather: { select: { motherId: true } },
        childrenAsMother: { select: { fatherId: true } }
      }
    });

    // Transform data for tree visualization
    const nodes = persons.map((person: any) => {
      // Get spouse IDs from formal marriages
      const formalSpouses = person.gender === 'MALE'
        ? person.marriagesAsHusband.map((m: any) => m.wifeId)
        : person.marriagesAsWife.map((m: any) => m.husbandId);

      // Get spouse IDs from shared children (inferring parents are a couple)
      const inferredSpouses = person.gender === 'MALE'
        ? person.childrenAsFather.map((c: any) => c.motherId).filter(Boolean)
        : person.childrenAsMother.map((c: any) => c.fatherId).filter(Boolean);

      // Unique spouse IDs
      const spouseIds = Array.from(new Set([...formalSpouses, ...inferredSpouses]));

      return {
        id: person.id,
        fullName: person.fullName,
        nickname: person.nickname,
        gender: person.gender,
        birthDate: person.birthDate,
        deathDate: person.deathDate,
        profilePhoto: person.profilePhoto,
        fatherId: person.fatherId,
        motherId: person.motherId,
        spouseIds
      };
    });

    res.json({ nodes });
  } catch (error) {
    console.error('Get family tree error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pohon keluarga.' });
  }
};

// Get children of a person
export const getChildren = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const personId = String(id);

    const person = await prisma.person.findUnique({
      where: { id: personId },
      select: { gender: true }
    });

    if (!person) {
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    const children = await prisma.person.findMany({
      where: person.gender === 'MALE' ? { fatherId: personId } : { motherId: personId },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        gender: true,
        birthDate: true,
        profilePhoto: true
      },
      orderBy: { birthDate: 'asc' }
    });

    res.json(children);
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};

// Get siblings of a person
export const getSiblings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const personId = String(id);

    const person = await prisma.person.findUnique({
      where: { id: personId },
      select: { fatherId: true, motherId: true }
    });

    if (!person) {
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    if (!person.fatherId && !person.motherId) {
      return res.json([]);
    }

    const orConditions: any[] = [];
    if (person.fatherId && person.motherId) {
      orConditions.push({ fatherId: person.fatherId, motherId: person.motherId });
    }
    if (person.fatherId) {
      orConditions.push({ fatherId: person.fatherId });
    }
    if (person.motherId) {
      orConditions.push({ motherId: person.motherId });
    }

    const siblings = await prisma.person.findMany({
      where: {
        id: { not: personId },
        OR: orConditions
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        gender: true,
        birthDate: true,
        profilePhoto: true,
        fatherId: true,
        motherId: true
      },
      orderBy: { birthDate: 'asc' }
    });

    // Mark full/half siblings
    const result = siblings.map((s: any) => ({
      ...s,
      siblingType: (s.fatherId === person.fatherId && s.motherId === person.motherId) 
        ? 'full' 
        : 'half'
    }));

    res.json(result);
  } catch (error) {
    console.error('Get siblings error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};

// Search persons
export const searchPersons = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json([]);
    }

    const take = Number(limit);
    if (!Number.isInteger(take) || take < 1 || take > 50) {
      return validationError(res, 'Limit pencarian harus angka 1 sampai 50.');
    }

    const persons = await prisma.person.findMany({
      where: {
        OR: [
          { fullName: { contains: q } },
          { nickname: { contains: q } }
        ]
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        gender: true,
        birthDate: true,
        profilePhoto: true
      },
      take,
      orderBy: { fullName: 'asc' }
    });

    res.json(persons);
  } catch (error) {
    console.error('Search persons error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};
