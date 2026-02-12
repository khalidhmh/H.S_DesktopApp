import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // Hash password '123456'
  const hashedPassword = bcrypt.hashSync('123456', 10)

  // 1. إنشاء المستخدمين (Manager & Supervisor)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@system.com' },
    update: {
      password: hashedPassword // Update password even if exists
    },
    create: {
      email: 'manager@system.com',
      password: hashedPassword,
      name: 'System Manager',
      role: 'MANAGER'
    }
  })

  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@system.com' },
    update: {
      password: hashedPassword // Update password even if exists
    },
    create: {
      email: 'supervisor@system.com',
      password: hashedPassword,
      name: 'Building Supervisor',
      role: 'SUPERVISOR'
    }
  })

  // 2. إنشاء الغرف أولاً (عشان نعرف نسكن الطلاب فيها)
  console.log('🏢 Creating rooms for Building A...')
  const createdRooms = []
  for (let floor = 1; floor <= 3; floor++) {
    for (let roomNum = 1; roomNum <= 5; roomNum++) {
      const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`
      let status = 'AVAILABLE'

      if (floor === 1 && roomNum === 3) status = 'MAINTENANCE'

      const room = await prisma.room.upsert({
        where: { roomNumber_building: { roomNumber: roomNumber, building: 'المبنى أ' } },
        update: {},
        create: {
          roomNumber: roomNumber,
          building: 'المبنى أ',
          floor: floor,
          capacity: 3,
          currentCount: 0, // هنحدثه بعد قليل
          status: status
        }
      })
      createdRooms.push(room)
    }
  }

  // 3. إنشاء الطلاب وربط أول طالبين بأول غرفة متاحة
  const studentsData = [
    {
      name: 'Ahmed Ali',
      universityId: '2024001',
      college: 'Engineering',
      year: '1',
      nationalId: '10000000000001',
      status: 'ACTIVE',
      roomId: createdRooms[0].id
    },
    {
      name: 'Mohamed Samy',
      universityId: '2024002',
      college: 'Medicine',
      year: '2',
      nationalId: '10000000000002',
      status: 'ACTIVE',
      roomId: createdRooms[0].id
    },
    {
      name: 'Sara Hassan',
      universityId: '2024003',
      college: 'Science',
      year: '1',
      nationalId: '10000000000003',
      status: 'EVACUATED'
    },
    {
      name: 'Khaled Hussein',
      universityId: '20240325',
      college: 'Arts',
      year: '3',
      nationalId: '10000000000004',
      status: 'ACTIVE'
    }
  ]

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { universityId: student.universityId },
      update: {},
      create: student
    })
  }

  // 4. تحديث عدد الطلاب في الغرفة (Manual update as per schema)
  await prisma.room.update({
    where: { id: createdRooms[0].id },
    data: { currentCount: 2 }
  })

  console.log('✅ Seeding finished successfully.')
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
