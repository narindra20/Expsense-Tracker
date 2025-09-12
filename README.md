# 💰 Expense Tracker

Welcome to **Expense Tracker**, a modern web application built with **React.js** and **Tailwind CSS**.  
It helps users **track their incomes and expenses**, manage categories, and visualize financial data month by month.  

This project was created as a learning opportunity to practice **full-stack development** using **React**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Features

- ➕ Add, edit, and delete **expenses**  
- 💵 Add, edit, and delete **incomes**  
- 🏷️ Categorize expenses and incomes  
- 📊 Dashboard with monthly overview  
- 🧑‍💻 User authentication and profile management  
- 🗂️ Organized structure with reusable components  
- 🎨 Clean and responsive user interface with Tailwind CSS  

---

## 📁 Project Structure

```
Expense-Tracker/
├── prisma/ # Prisma schema and migrations
├── server/ # Backend (Express + Prisma)
│ ├── routes/ # API routes (users, incomes, expenses, categories)
│ ├── middleware/ # Auth and error handling
│ └── db.js # Database connection
├── src/ # Frontend (React)
│ ├── components/ # Reusable components (Sidebar, Dashboard, etc.)
│ ├── pages/ # Main app pages
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point
├── package.json # Dependencies
├── schema.prisma # Database schema
├── tailwind.config.js # Tailwind CSS configuration
└── README.md # This file
```

---

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/narindra20/Expsense-Tracker.git
cd Expsense-Tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup database**
- Update the .env file with your PostgreSQL connection string, then run:

```bash
npx prisma migrate dev
```

4. **Start the development server**

```bash
npm run dev
```
- Open http://localhost:5000
 in your browser for the backend and your frontend dev server URL (usually http://localhost:5173
).

##  Built With

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [PokéAPI](https://pokeapi.co/) *(if you're using it)*

---

##  Authors

Project developed by:

- [@narindra20](https://github.com/narindra20)
- [@AngelaHarim](https://github.com/Angela-Harim)
- [@lovaFY](https://github.com/lovaFy)

---

##  License

This project is open-source and free to use for learning or personal projects.

---

