# frontend

## suggested project structure

```plaintext
frontend/
├── README.md
├── .gitignore
├── .env.example
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile.dev
├── Dockerfile.prod
├── docker-compose.yml
├── 
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│       ├── pro-mata-logo.png
│       ├── accommodations/
│       └── activities/
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── 
│   ├── components/
│   │   ├── ui/                      # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── table.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ReservationForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── DataTable.tsx
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── LoginComponent.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       ├── reservations/
│   │       │   ├── ReservationList.tsx
│   │       │   ├── ReservationCard.tsx
│   │       │   ├── ReservationCalendar.tsx
│   │       │   └── ReservationDetails.tsx
│   │       ├── accommodations/
│   │       │   ├── AccommodationList.tsx
│   │       │   ├── AccommodationCard.tsx
│   │       │   ├── AccommodationDetails.tsx
│   │       │   └── AccommodationSearch.tsx
│   │       ├── activities/
│   │       │   ├── ActivityList.tsx
│   │       │   ├── ActivityCard.tsx
│   │       │   └── ActivityDetails.tsx
│   │       ├── admin/
│   │       │   ├── Dashboard.tsx
│   │       │   ├── UserManagement.tsx
│   │       │   ├── ReservationManagement.tsx
│   │       │   └── Reports.tsx
│   │       └── payment/
│   │           ├── PaymentSummary.tsx
│   │           └── PaymentConfirmation.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── AccommodationsPage.tsx
│   │   ├── ActivitiesPage.tsx
│   │   ├── ReservationsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminReservations.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminReports.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── index.tsx               # Tanstack Router configuration
│   │   ├── __root.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── reservations.tsx
│   │   │   └── users.tsx
│   │   ├── accommodations/
│   │   │   ├── index.tsx
│   │   │   └── $id.tsx
│   │   ├── activities/
│   │   │   ├── index.tsx
│   │   │   └── $id.tsx
│   │   └── reservations/
│   │       ├── index.tsx
│   │       ├── new.tsx
│   │       └── $id.tsx
│   │
│   ├── services/
│   │   ├── api.ts                  # Axios configuration
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── reservation.service.ts
│   │   ├── accommodation.service.ts
│   │   ├── activity.service.ts
│   │   └── payment.service.ts
│   │
│   ├── store/                      # State management
│   │   ├── index.ts
│   │   ├── auth.store.ts
│   │   ├── reservation.store.ts
│   │   ├── accommodation.store.ts
│   │   └── ui.store.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useForm.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── date.utils.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── reservation.types.ts
│   │   ├── accommodation.types.ts
│   │   ├── activity.types.ts
│   │   ├── payment.types.ts
│   │   └── api.types.ts
│   │
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── utils.css
│
├── tests/
│   ├── setup.ts
│   ├── components/
│   │   ├── Header.test.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── ReservationForm.test.tsx
│   ├── pages/
│   │   ├── HomePage.test.tsx
│   │   └── LoginPage.test.tsx
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   └── api.test.ts
│   └── utils/
│       ├── helpers.test.ts
│       └── validators.test.ts
│
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   ├── dev.sh
│   └── deploy.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-dev.yml
│       ├── cd-prod.yml
│       └── lighthouse.yml
│
└── docs/
    ├── SETUP.md
    ├── COMPONENTS.md
    ├── ROUTING.md
    ├── TESTING.md
    └── DEPLOYMENT.md
```
