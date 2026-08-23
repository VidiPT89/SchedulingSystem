import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()

  await prisma.service.createMany({
    data: [
      {
        namePt: 'Consulta de marca',
        nameEn: 'Brand consult',
        durationMinutes: 30,
        priceCents: 4500,
        descriptionPt: 'Meia hora para alinhar identidade, paleta e tom.',
        descriptionEn: 'Half an hour to align identity, palette and tone.',
      },
      {
        namePt: 'Sessão de retrato',
        nameEn: 'Portrait sitting',
        durationMinutes: 60,
        priceCents: 8900,
        descriptionPt: 'Uma hora de luz controlada, com prova no ecrã.',
        descriptionEn: 'One hour of controlled light, with on-screen proofing.',
      },
      {
        namePt: 'Atelier completo',
        nameEn: 'Full atelier',
        durationMinutes: 90,
        priceCents: 14000,
        descriptionPt: 'Direcção criativa, disparos e selecção no mesmo bloco.',
        descriptionEn: 'Creative direction, shooting and selection in one block.',
      },
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
