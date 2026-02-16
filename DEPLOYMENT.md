# 🚀 Інструкція з деплою Motocar Tracker

## Швидкий старт

Ваш проект готовий до деплою на **Render.com** - безкоштовному хостингу для full-stack додатків!

---

## 📋 Що потрібно зробити

### 1. Створити MongoDB Atlas (безкоштовна база даних)

1. Зайдіть на https://www.mongodb.com/cloud/atlas/register
2. Зареєструйтесь або увійдіть
3. Створіть **безкоштовний кластер** (M0 Sandbox)
4. У розділі **Database Access** створіть користувача БД:
   - Username: наприклад `motocar-user`
   - Password: згенеруйте складний пароль (збережіть його!)
5. У розділі **Network Access** додайте IP адресу:
   - Натисніть **Add IP Address**
   - Оберіть **Allow Access from Anywhere** (`0.0.0.0/0`)
6. У розділі **Database** натисніть **Connect**:
   - Оберіть **Connect your application**
   - Скопіюйте connection string (виглядає як `mongodb+srv://...`)
   - Замініть `<password>` на ваш пароль з кроку 4

---

### 2. Деплой на Render.com

#### Варіант А: Автоматичний деплой (рекомендовано)

1. Якщо код ще не на GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <ваш-github-repo-url>
   git push -u origin main
   ```

2. Зайдіть на https://render.com і увійдіть через GitHub

3. Натисніть **New +** → **Blueprint**

4. Підключіть ваш GitHub репозиторій

5. Render автоматично знайде `render.yaml` і створить 2 сервіси:
   - `motocar-tracker-api` (Backend)
   - `motocar-tracker-frontend` (Frontend)

6. Для Backend сервісу додайте змінні середовища:
   - `MONGO_URI`: ваш connection string з MongoDB Atlas
   - `CLIENT_URL`: `https://motocar-tracker-frontend.onrender.com` (змініть на ваше ім'я)
   - `JWT_SECRET`: буде згенеровано автоматично

7. Для Frontend сервісу додайте змінну:
   - `VITE_API_URL`: `https://motocar-tracker-api.onrender.com` (змініть на ваше backend URL)

8. Натисніть **Apply** - Render почне деплой!

#### Варіант Б: Ручний деплой

##### Backend:
1. На Render.com натисніть **New +** → **Web Service**
2. Підключіть GitHub репозиторій
3. Налаштування:
   - **Name**: `motocar-tracker-api`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`
4. Environment Variables:
   - `MONGO_URI`: ваш MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
   - `JWT_SECRET`: будь-який складний рядок (наприклад, згенеруйте на https://randomkeygen.com/)
5. Натисніть **Create Web Service**
6. **Збережіть URL вашого API** (наприклад, `https://motocar-tracker-api.onrender.com`)

##### Frontend:
1. На Render.com натисніть **New +** → **Static Site**
2. Підключіть той самий GitHub репозиторій
3. Налаштування:
   - **Name**: `motocar-tracker-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Plan**: `Free`
4. Environment Variables:
   - `VITE_API_URL`: URL вашого backend з кроку 6 (без слеша в кінці)
5. Натисніть **Create Static Site**

---

### 3. Оновлення CORS на Backend

Після створення Frontend, поверніться до Backend сервісу на Render та:

1. Відкрийте **Environment** → додайте/оновіть:
   - `CLIENT_URL`: повний URL вашого frontend (наприклад, `https://motocar-tracker-frontend.onrender.com`)

2. Render автоматично передеплоїть backend з новими налаштуваннями

---

## ✅ Готово!

Ваш сайт тепер онлайн! 🎉

- **Frontend URL**: `https://your-frontend-name.onrender.com`
- **Backend URL**: `https://your-backend-name.onrender.com`

---

## 🔄 Як оновлювати сайт

Просто робіть `git push` в ваш GitHub репозиторій - Render автоматично передеплоїть зміни!

```bash
git add .
git commit -m "Опис змін"
git push
```

---

## ⚠️ Важливі нотатки про безкоштовний план

1. **Сервіси засинають після 15 хв неактивності** - перше завантаження може зайняти 30-60 сек
2. **750 годин на місяць** - достатньо для демо
3. **Обмеження бази даних**: 512 МБ на MongoDB Atlas Free tier

---

## 🆘 У разі проблем

### Backend не працює:
- Перевірте логи в Render Dashboard → Backend Service → Logs
- Переконайтеся, що `MONGO_URI` правильний і БД доступна
- Перевірте, що IP `0.0.0.0/0` додано в MongoDB Atlas Network Access

### Frontend не може з'єднатися з Backend:
- Перевірте `VITE_API_URL` у Frontend Environment Variables
- Перевірте `CLIENT_URL` у Backend Environment Variables
- Відкрийте браузерну консоль (F12) для перегляду помилок

### CORS помилки:
- Переконайтесь, що `CLIENT_URL` в Backend точно збігається з URL Frontend (без слеша в кінці)

---

## 🎯 Альтернативні платформи

Якщо Render не підходить:

1. **Vercel** (для frontend) + **Railway** (для backend + DB)
2. **Netlify** (frontend) + **Fly.io** (backend) + **MongoDB Atlas**
3. **Cloudflare Pages** (frontend) + **Render** (backend)

---

**Успіхів з деплоєм! 🚀**
