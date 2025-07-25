# drivent-semana4

## 🚀 Introdução (Português)

Este projeto foi desenvolvido durante a Semana 4 do bootcamp **Driven**, como parte do processo de aprendizado em desenvolvimento Full Stack. O objetivo principal é consolidar conhecimentos adquiridos em Node.js, Express, PostgreSQL, TypeScript e boas práticas para APIs REST.

## 📝 Sobre o Projeto

O **drivent-semana4** é uma aplicação Back-End que implementa funcionalidades típicas de um sistema de eventos, como cadastro de usuários, gerenciamento de inscrições e organização de atividades. Foi projetado para servir de base para estudos e aprimoramento técnico.

## 🔧 Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Dotenv

## 📦 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em ambiente de desenvolvimento:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DanBellini/drivent-semana4.git
   ```

2. **Acesse o diretório do projeto:**
   ```bash
   cd drivent-semana4
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**  
   - Crie um arquivo `.env` baseado no `.env.example` e preencha com suas configurações de banco de dados.

5. **Execute as migrações do banco de dados:**
   ```bash
   npx prisma migrate dev
   ```

6. **Popule o banco de dados com dados iniciais (opcional):**
   ```bash
   npm run prisma:seed
   ```

7. **Inicie a aplicação:**
   ```bash
   npm run dev
   ```

8. **Utilize um cliente HTTP (Thunder Client, Insomnia, Postman, etc.) para testar as rotas e funcionalidades.**

## 🎯 Funcionalidades Principais

- Cadastro e autenticação de usuários
- Gerenciamento de inscrições em eventos
- Organização e consulta de atividades
- Estrutura modular para fácil expansão

## 💡 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests.

## 👤 Autor

- [DanBellini](https://github.com/DanBellini)

---

---

# drivent-semana4

## 🚀 Introduction (English)

This project was developed during Week 4 of the **Driven** bootcamp, as part of the learning process in Full Stack development. The main goal is to consolidate knowledge acquired in Node.js, Express, PostgreSQL, TypeScript, and REST API best practices.

## 📝 About the Project

**drivent-semana4** is a Back-End application that implements typical features of an event management system, such as user registration, enrollment management, and activity organization. It was designed to serve as a foundation for studies and technical improvement.

## 🔧 Technologies Used

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Dotenv

## 📦 How to Run the Project

Follow the steps below to run the project in a development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DanBellini/drivent-semana4.git
   ```

2. **Access the project directory:**
   ```bash
   cd drivent-semana4
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment variables:**  
   - Create a `.env` file based on `.env.example` and fill in your database configuration.

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database with initial data (optional):**
   ```bash
   npm run prisma:seed
   ```

7. **Start the application:**
   ```bash
   npm run dev
   ```

8. **Use an HTTP client (Thunder Client, Insomnia, Postman, etc.) to test routes and features.**

## 🎯 Main Features

- User registration and authentication
- Event enrollment management
- Activity organization and query
- Modular structure for easy expansion

## 💡 Contribution

Contributions are welcome! Feel free to open issues, suggest improvements, or submit pull requests.

## 👤 Author

- [DanBellini](https://github.com/DanBellini)

---
