# Admin Guide: Managing Users and Authentication

This guide provides detailed instructions for administrators on how to manage users, authentication, and system settings for the Near Me Directory platform.

## Table of Contents

1. [Admin User Setup](#admin-user-setup)
2. [Business Owner User Setup](#business-owner-user-setup)
3. [Authentication Management](#authentication-management)
4. [Admin Dashboard](#admin-dashboard)
5. [Security Best Practices](#security-best-practices)

---

## Admin User Setup

### Creating an Admin User

The system includes a script to create admin users with full access to administrative features. This script creates a user in Supabase Auth and sets the appropriate role in the `business_profiles` table.

#### Prerequisites

- Supabase project URL
- Supabase service role key (found in your Supabase dashboard under Project Settings > API)
- Node.js installed on your machine

#### Steps to Create an Admin User

1. Run the admin creation script:

```bash
npm run create-admin
```

2. When prompted, enter the following information:
   - Supabase URL (e.g., `https://your-project.supabase.co`)
   - Supabase service role key
   - Admin email address
   - Admin password
   - Business name (or "Admin")

3. The script will:
   - Create a new user in Supabase Auth
   - Skip email confirmation
   - Create a profile with the 'admin' role
   - Display confirmation of successful creation

#### Example Output

```
🔐 Admin User Setup Script
==========================
This script will create an admin user in your Supabase project.

Enter your Supabase URL: https://example.supabase.co
Enter your Supabase service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Enter admin email: admin@example.com
Enter admin password: ********
Enter business name (or "Admin"): Directory Admin

🔄 Creating admin user...
✅ User created successfully
📧 Email: admin@example.com
✅ Admin profile created successfully
👤 User ID: 550e8400-e29b-41d4-a716-446655440000
👑 Role: admin

🎉 Admin user setup complete!
You can now log in with the provided email and password.
```

### Troubleshooting Admin Creation

If you encounter errors during admin user creation:

1. **"Error creating user"**: 
   - Verify your Supabase URL and service role key
   - Check if the email is already in use
   - Ensure password meets strength requirements (min 6 characters)

2. **"Error creating admin profile"**:
   - Verify the `business_profiles` table exists in your database
   - Check if the user was created successfully before the profile error

3. **"Network error"**:
   - Check your internet connection
   - Verify the Supabase URL is correct and accessible

---

## Business Owner User Setup

### Creating a Business Owner User

The system includes a script to create business owner users who can access the business dashboard. This script creates a user in Supabase Auth and sets up their business profile.

#### Prerequisites

- Supabase project URL
- Supabase service role key (found in your Supabase dashboard under Project Settings > API)
- Node.js installed on your machine

#### Steps to Create a Business Owner User

1. Run the business owner creation script:

```bash
npm run create-business-owner
```

2. When prompted, enter the following information:
   - Supabase URL (e.g., `https://your-project.supabase.co`)
   - Supabase service role key
   - Business owner email address
   - Business owner password
   - Business name
   - Business ID (e.g., `nail-salons-dallas-01`)

3. The script will:
   - Create a new user in Supabase Auth
   - Skip email confirmation
   - Create a profile with the 'owner' role
   - Link the user to their business
   - Display confirmation of successful creation

#### Example Output

```
👤 Business Owner User Setup Script
==================================
This script will create a business owner user in your Supabase project.

Enter your Supabase URL: https://example.supabase.co
Enter your Supabase service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Enter business owner email: owner@elegantails.com
Enter business owner password: ********
Enter business name: Elegant Nails Studio
Enter business ID (e.g., nail-salons-dallas-01): nail-salons-dallas-01

🔄 Creating business owner user...
✅ User created successfully
📧 Email: owner@elegantails.com
✅ Business owner profile created successfully
👤 User ID: 550e8400-e29b-41d4-a716-446655440000
🏢 Business: Elegant Nails Studio
🔑 Role: owner

🎉 Business owner setup complete!
The user can now log in with the provided email and password to access the business dashboard.
```

### Troubleshooting Business Owner Creation

If you encounter errors during business owner user creation:

1. **"Error creating user"**: 
   - Verify your Supabase URL and service role key
   - Check if the email is already in use
   - Ensure password meets strength requirements (min 6 characters)

2. **"Error creating business owner profile"**:
   - Verify the `business_profiles` table exists in your database
   - Check if the user was created successfully before the profile error

3. **"Business ID not found"**:
   - The business ID is optional - if not provided, the user will still be created
   - You can update the business ID later through the admin dashboard

---

## Authentication Management

### Toggling Authentication Features

The system includes a script to enable or disable authentication features without accessing the admin dashboard. This is useful for maintenance or when you need to quickly disable login functionality.

#### Steps to Toggle Authentication

1. Run the authentication toggle script:

```bash
npm run toggle-auth
```

2. When prompted, choose whether to enable or disable login functionality:
   - Enter `y` to enable login
   - Enter `n` to disable login

3. The script will:
   - Update the configuration in `.config/auth-features.json`
   - Update the `.env` file with the new settings
   - Display confirmation of the changes

#### Example Output

```
🔐 Auth Features Toggle Script
=============================
This script allows you to toggle authentication features.

Current settings:
- Login enabled: Yes ✅

Enable login? (y/n) [y]: n

✅ Auth feature flags saved to /home/project/.config/auth-features.json
✅ Environment variables updated in .env file

✅ Auth features updated successfully:
- Login enabled: No ❌

Restart your application for changes to take effect.
```

### Effects of Disabling Login

When login is disabled:

1. Users cannot access the login page (redirected to home)
2. Protected routes redirect to home instead of login
3. Existing sessions remain active until expiration
4. The login button in the header is hidden

### Re-enabling Login

To re-enable login functionality, run the toggle script again and select `y` when prompted.

---

## Admin Dashboard

### Accessing the Admin Dashboard

Once you've created an admin user, you can access the admin dashboard:

1. Log in with your admin credentials at `/login`
2. Navigate to `/admin/dashboard` to access the admin dashboard

### Available Admin Settings

The admin dashboard provides the following settings:

#### Authentication Settings

- **User Login**: Enable or disable user login functionality
  - When disabled, users cannot log in and are redirected to the home page
  - Useful for maintenance or security lockdowns

#### Future Settings (Coming Soon)

- User management
- Business approval workflow
- Content moderation
- System notifications

---

## Security Best Practices

### Admin Account Security

1. **Strong Passwords**: Use complex passwords (12+ characters, mixed case, numbers, symbols)
2. **Unique Email**: Use a dedicated email for admin accounts
3. **Limited Access**: Only create admin accounts when necessary
4. **Regular Rotation**: Change admin passwords periodically

### Service Role Key Security

The Supabase service role key has full access to your database. To keep it secure:

1. **Never expose it in client-side code**
2. **Only use it for admin scripts and server-side operations**
3. **Rotate the key if you suspect it has been compromised**
4. **Do not commit it to version control**

### Business Owner Account Security

1. **Verify Identity**: Confirm the business owner's identity before creating their account
2. **Secure Delivery**: Send credentials securely to the business owner
3. **Password Reset**: Encourage business owners to reset their password after first login
4. **Access Review**: Periodically review business owner accounts for suspicious activity

### Monitoring Admin Actions

1. Keep track of who has admin access
2. Review admin actions regularly
3. Remove admin access when no longer needed
4. Consider implementing audit logging for admin actions

---

## Technical Reference

### Database Schema

The admin system uses the following tables:

#### business_profiles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| business_id | text | Business identifier |
| business_name | text | Business name |
| email | text | Contact email |
| role | text | 'owner', 'admin', or 'staff' |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### Environment Variables

The following environment variables control authentication:

```
VITE_AUTH_LOGIN_ENABLED=true|false
```

### Configuration Files

Auth settings are stored in:

- `.config/auth-features.json` - Local configuration
- `.env` - Environment variables for the application