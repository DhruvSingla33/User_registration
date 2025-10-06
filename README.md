

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/DhruvSingla33/User_registration.git

```
#### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install 
```
### 🔐 Setup Environment Variables


#### 📂 `server/.env`

```env
# Server Configuration
PORT=5000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASS=Dhruv3030@123
DB_NAME=otp_demo11
DB_DIALECT=mysql

# JWT Secret
JWT_SECRET=your_jwt_secret

# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=Your_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=Your_TWILIO_AUTH_TOKEN
TWILIO_PHONE_FROM=Your_TWILIO_PHONE_FROM

# OTP Settings
OTP_EXPIRES_MINUTES=10
OTP_MAX_ATTEMPTS=5

```


### 🚀 Running the App

Open two terminals and run:

#### 🖥️ Terminal 1: Start Backend

```bash
cd backend
node index.js
```
#### 🖥️ Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```


### ✅ Ready to Go!

Visit your app at:

- 🔗 Frontend: [http://localhost:5173](http://localhost:5173)
- 🔗 Backend: [http://localhost:5000](http://localhost:5000)

---


