# 📅 Scheduling System

> A bilingual atelier calendar for services with duration, open slots, email confirmation and a one-hour reminder, painted in the ividi.dev palette (black, burnt orange, amber).

[![CI](https://github.com/VidiPT89/SchedulingSystem/actions/workflows/ci.yml/badge.svg)](https://github.com/VidiPT89/SchedulingSystem/actions/workflows/ci.yml)

[🐞 Report Bug](https://github.com/VidiPT89/SchedulingSystem/issues) · [✨ Request Feature](https://github.com/VidiPT89/SchedulingSystem/issues)

Scheduling System is a Next.js desk for booking timed services. Register a service and its duration, pick an open slot on the calendar, receive a confirmation email, and get a reminder one hour before. The admin desk lists services, appointments and the mail outbox. The UI is European Portuguese / English, with the language toggle remembered in `localStorage`.

## ✨ Main Features

- ✂️ **Services and duration** — name, length, price and bilingual copy
- 📆 **Calendar slots** — working day 09:00–18:00, busy blocks hidden
- ✉️ **Email confirmation** — SMTP when configured, otherwise stored in the admin outbox
- ⏰ **Reminder 1 hour before** — polled while the app is open, or via `/api/cron/reminders`
- 🎛️ **Admin view** — password gate, service form, appointments and outbox
- 🌍 **PT / EN toggle** — remembered in `localStorage`
- 🎬 **Motion** — ember glow and staggered service cards

## 🛠️ Technologies

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-4-770C56?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)

| Category | Technology | Purpose |
|----------|-----------|---------|
| **App** | Next.js App Router | Booking UI, admin desk and API routes |
| **Data** | Prisma + SQLite | Services, appointments and mail log |
| **Dates** | date-fns | Slot grid, overlap checks and reminder window |
| **Mail** | Nodemailer | Confirmation and reminder (optional SMTP) |
| **Motion** | Framer Motion | Hero and card reveal |

## 🧱 Project Structure

```text
SchedulingSystem/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── components/
│   ├── i18n/
│   └── lib/
├── tests/
├── LICENSE
└── README.md
```

## ▶️ How to Run

### Prerequisites

- **Node.js** 18+

### Installation

```bash
git clone https://github.com/VidiPT89/SchedulingSystem.git
cd SchedulingSystem
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

SMTP is optional. Leave those keys empty to keep confirmation and reminder copies in the admin outbox. The default admin password is `studio` (`ADMIN_PASSWORD` in `.env`).

## 📖 Usage

1. Toggle **PT** or **EN** in the header.
2. Pick a service, a day and an open slot, then confirm with name and email.
3. Open **Admin**, sign in, add more services and review appointments or the outbox.
4. Keep the app running so the one-hour reminder can fire, or call `GET/POST /api/cron/reminders`.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Active services |
| GET | `/api/slots?serviceId=&day=` | Open and taken slots for a day |
| POST | `/api/appointments` | Book a slot and send confirmation |
| GET/POST | `/api/cron/reminders` | Send due one-hour reminders |
| POST | `/api/admin/login` | Admin cookie |
| GET | `/api/admin/services` | Admin service list |
| POST | `/api/admin/services` | Create a service |
| GET | `/api/admin/appointments` | All bookings |
| PATCH | `/api/admin/appointments/:id` | Cancel a booking |
| GET | `/api/admin/outbox` | Confirmation and reminder log |

## 🧪 Testing

```bash
npm test
```

`node:test` checks slot overlap and the one-hour reminder window.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

---

Developed by **David Arsénio Martins**  
🌐 [ividi.dev](https://ividi.dev/) · 💻 [github.com/VidiPT89](https://github.com/VidiPT89/)
