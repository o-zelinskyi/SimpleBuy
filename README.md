# SimpleBuy

A simple educational web application for buying and selling projects. Buyers browse the catalog, place orders for projects, and sellers manage their listings and orders.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Angular Material, RxJS |
| Backend | ASP.NET Core (Web API), Entity Framework Core |
| Database | SQL Server |

## Repository Structure

```text
SimpleBuy/
├── backend/
│   └── PortfolioAspNet/        # ASP.NET Core Web API
│       ├── Controllers/        # AuthController, ProjectsController, OrdersController
│       ├── Entities/           # User, Role, Project, Order
│       ├── Repositories/       # Generic repository pattern
│       ├── Migrations/         # EF Core migrations
│       └── Program.cs
└── frontend/
    └── src/app/
        ├── core/               # Guards, interceptors, services, models
        ├── features/
        │   ├── auth/           # Login & Register pages
        │   ├── projects-list/  # Product catalog
        │   └── orders-history/ # Order history
        └── shared/             # Reusable components
```

## Functionality

### User Roles
- **Admin** — can view all orders in the system
- **Seller** — can create, edit, and delete their own projects; can view orders for those projects
- **Buyer** — can browse the catalog, purchase projects, and view their own order history

### API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registration |
| GET | `/api/auth/roles` | List of roles |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/{id}` | Get project by ID |
| POST | `/api/projects` | Create project (Seller) |
| PUT | `/api/projects/{id}` | Update project (Seller) |
| DELETE | `/api/projects/{id}` | Delete project (Seller) |
| GET | `/api/orders?userId=&role=` | Get orders (filtered by role) |
| POST | `/api/orders` | Create order (Buyer) |
| PATCH | `/api/orders/{id}/status` | Change order status |

### Order Statuses
`Pending` → `Confirmed` / `Cancelled`

## Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and npm 10+
- SQL Server (local or Docker)

### Backend

1. Open `backend/PortfolioAspNet/appsettings.json` and specify your database connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=SimpleBuy;Trusted_Connection=True;TrustServerCertificate=True"
}
```

2. Apply migrations and run the API:

```bash
cd backend/PortfolioAspNet
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm start
```
