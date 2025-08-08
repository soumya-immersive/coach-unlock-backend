### **1. Overview**

This backend powers the **Coach Unlock App**, handling:

* User management (tokens, XP)
* Coach listings
* Unlock history and XP logging
* MySQL database operations

---

### **2. Prerequisites**

* **Node.js** v18+
* **MySQL** v8+
* **npm** (comes with Node.js)

---

### **3. Setup & Installation**

#### **Step 1 – Clone the repository**

```bash
git clone <your-backend-repo-url>
cd coach-unlock-backend

```

#### **Step 2 – Install dependencies**

```bash
npm install
```

#### **Step 3 – Create and configure `.env`**

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=coach_app
```

#### **Step 4 – Setup MySQL database**

Run the following SQL in **MySQL Workbench** or CLI:

```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS `coach_app`;
CREATE DATABASE `coach_app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `coach_app`;

-- Users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `tokens` INT NOT NULL DEFAULT 0,
  `xp` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Coaches table
CREATE TABLE `coaches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `cost` INT NOT NULL DEFAULT 10,
  `xp_award` INT NOT NULL DEFAULT 5,
  `red_flag` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Unlocks log table
CREATE TABLE `coach_unlocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `coach_id` INT NOT NULL,
  `tokens_spent` INT NOT NULL,
  `xp_awarded` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`coach_id`) REFERENCES `coaches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- XP logs table
CREATE TABLE `xp_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `change` INT NOT NULL,
  `reason` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data
INSERT INTO `users` (`name`, `tokens`, `xp`) VALUES
('Alice', 50, 10),
('Bob', 15, 0);

INSERT INTO `coaches` (`name`, `description`, `cost`, `xp_award`, `red_flag`) VALUES
('Coach A', 'Focus on time management', 10, 5, 0),
('Coach B', 'Controversial methods', 10, 5, 1),
('Coach C', 'Strength training', 10, 5, 0);

INSERT INTO `coach_unlocks` (`user_id`, `coach_id`, `tokens_spent`, `xp_awarded`) VALUES
(1, 1, 10, 5);
```

#### **Step 5 – Start backend server**

```bash
npm run dev
```

The backend will run at:
**`http://localhost:4000`**

---

### **4. API Endpoints**

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/api/user/:id`                | Get user details          |
| POST   | `/api/user/:id/add-tokens`     | Add tokens to user        |
| GET    | `/api/coaches`                 | Get list of coaches       |
| POST   | `/api/coaches/:coachId/unlock` | Unlock a coach for a user |

---
