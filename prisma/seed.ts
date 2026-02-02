import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seeding...')

    // 1. إنشاء مدير (Manager)
    const manager = await prisma.user.upsert({
        where: { username: 'manager' },
        update: {},
        create: {
            username: 'manager',
            password: '123', // في الحقيقة بنشفرها، بس دلوقتي للتجربة
            fullName: 'المدير العام',
            role: 'MANAGER',
        },
    })

    // 2. إنشاء مشرف (Supervisor)
    const supervisor = await prisma.user.upsert({
        where: { username: 'supervisor' },
        update: {},
        create: {
            username: 'supervisor',
            password: '123',
            fullName: 'مشرف المبنى أ',
            role: 'SUPERVISOR',
        },
    })

    console.log({ manager, supervisor })
    console.log('✅ Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })