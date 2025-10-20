# Utility Scripts

This directory contains utility scripts for managing the application.

## Create Admin User

The `create-admin.ts` script allows you to create a new admin user or upgrade an existing user to admin role.

### Prerequisites

- Ensure your database is set up and accessible
- Have your `DATABASE_URL` configured in `.env`
- Install dependencies: `npm install`

### Usage

Run the script using tsx (TypeScript executor):

```bash
npx tsx scripts/create-admin.ts
```

The script will interactively prompt you for:

1. **Email** - The admin user's email address (must be valid)
2. **Password** - A secure password (minimum 8 characters)
3. **Display Name** - Optional display name (defaults to email username if left blank)

### Features

- ✅ Interactive prompts for user input
- ✅ Email validation
- ✅ Password strength requirement (min 8 characters)
- ✅ Secure password hashing with bcrypt
- ✅ Checks for existing users
- ✅ Can upgrade existing users to admin
- ✅ Automatically sets `emailVerified: true`
- ✅ Creates profile with display name
- ✅ Error handling for duplicate emails

### Example Session

```
🔐 Admin User Creation Script
================================

Enter admin email: admin@example.com
Enter admin password (min 8 characters): ********
Enter display name (or press Enter to use email): Admin User

📝 Creating admin user...

✅ Admin user created successfully!
================================
Email: admin@example.com
Display Name: Admin User
Role: ADMIN
ID: clxxxxxxxxxxxxxxxxxxxxx
Email Verified: true
================================

You can now login with these credentials.
```

### Upgrading Existing User to Admin

If a user with the email already exists, the script will ask if you want to upgrade them to admin:

```
⚠️  User with this email already exists!
Do you want to make this user an admin? (yes/no): yes

✅ User updated to admin successfully!
```

### Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- Never commit admin credentials to version control
- Use strong passwords for admin accounts
- Admin users have elevated privileges across the platform

### Troubleshooting

**"Invalid email address"**
- Ensure the email contains an @ symbol and is properly formatted

**"Password must be at least 8 characters"**
- Use a longer, more secure password

**"User with this email already exists"**
- Choose a different email or upgrade the existing user to admin

**Database connection errors**
- Check your `DATABASE_URL` in `.env`
- Ensure the database is running and accessible
- Run `npx prisma migrate deploy` if needed
