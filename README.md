# 🏥 Clínic Frontend — Angular 20 + TailwindCSS 

![Angular](https://img.shields.io/badge/Angular-20-red)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-lightblue)
![Status](https://img.shields.io/badge/status-active-success)

Frontend of the clinical management system developed in **Angular 20**, which consumes the Spring Boot backend API available in this repository:

👉 [clinic-management-backend](https://github.com/Lenin-LG/clinic-management-backend.git)

---

## 🚀 Key Features

- 👨‍⚕️ Patient, doctor, and specialty management.
- 🔐 Secure endpoint authentication and consumption.
- 🧭 Dynamic navigation using Angular Router.
- 🧠 Reactive forms with validations.
- 🎨 Modern design with Tailwind CSS.
- ⚙️ Configurable backend connection per environment.
- 🧪 Unit testing with Karma and Jasmine.

---

## 🧱 Main technologies and dependencies

**Departments:**
- Angular Core (`@angular/core`)
- Angular Forms (`@angular/forms`)
- Angular Router (`@angular/router`)
- RxJS (`rxjs`)
- TSLib (`tslib`)

**Development dependencies:**
- Angular CLI (`@angular/cli`)
- TypeScript (`typescript`)
- TailwindCSS (`tailwindcss`)
- PostCSS (`postcss`)
- Autoprefixer (`autoprefixer`)
- Karma + Jasmine (testing)

---

## ⚙️ Local installation and execution

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lenin-LG/clinic-management-frontend.git
   cd clinic-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   ng serve
   ```

4. **Open in browser**
   ```
   http://localhost:4200/
   ```

---

## 🌐 Backend Integration

The frontend communicates with the REST API developed in Spring Boot.

You can configure the backend's base URL in the following file:

```
src/environments/environment.ts
```

Example:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/'
};
```

---

## 🧑‍💻 Author

**Lenin Laura García**  
Backend Developer & AWS  
🔗 [GitHub](https://github.com/Lenin-LG)
