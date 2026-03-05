# DocEye - Doctor Portal – Backend (Express.js + TypeScript)

Secure, scalable, and real-time enabled backend for a full-stack doctor appointment platform supporting patients, doctors, and admins.

**Live Demo:** https://doc-eye.vercel.app  
**Frontend Repository:** https://github.com/habib-utsho/doc-eye-client  
**Backend Repository:** https://github.com/habib-utsho/doc-eye-server

## ✨ Core Features

- Role-based authentication & authorization (Patient | Doctor | Admin)
- Appointment scheduling with real-time availability
- **AamarPay** payment gateway integration
- **Real-time chat** using Socket.IO
- Video call orchestration with Jitsi Meet
- Prescription & consultation history management
- Full admin control panel
- Dark mode preference sync
- File upload (prescriptions, profile images) via Multer

## 🛠 Tech Stack

| Technology          | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| Express.js          | Web framework                                  |
| TypeScript          | Type safety                                    |
| Socket.IO           | Real-time bidirectional communication          |
| MongoDB + Mongoose  | Database & ODM (assumed – adjust if different) |
| Multer + Cloudinary | File uploads                                   |
| AamarPay SDK        | Payment processing                             |
| Brevo               | Real-Time Email Notifications                  |
| Jitsi               | Video call                                     |
| JWT                 | Authentication                                 |
| bcrypt              | Password hashing                               |
| dotenv              | Environment management                         |
| Winston / Morgan    | Logging (optional)                             |

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### Environment Variables (.env)

```bash
NODE_ENV=development/production
PORT=
SOCKET_PORT=
MONGO_URI=
SALT_ROUNDS=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
CLIENT_URL=
SERVER_URL=
SERVER_DOMAIN=
DOCTOR_DEFAULT_PASSWORD=
ADMIN_DEFAULT_PASSWORD=
NODE_MAILER_USER=
NODE_MAILER_PASSWORD=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_URL=
```

### Installation

```bash
git clone https://github.com/habib-utsho/doc-eye-server
cd doc-eye-server
yarn install
```

### Development

```bash
yarn dev
```

### Production Build

```bash
yarn build
```

## 🔒 License

**Proprietary Software – All Rights Reserved**
