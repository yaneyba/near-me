# Slack Notifications Setup

This document describes the Slack notification system integrated into the Near Me application.

## Overview

The application now sends real-time notifications to Slack for all form submissions and administrative actions. This helps the team stay informed about new submissions and track the status of business applications.

## Slack Webhook Configuration

**Webhook URL**: `https://hooks.slack.com/services/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`

This webhook is configured in the following files:
- `functions/api/contact.ts` - Contact form submissions
- `functions/api/submit-business.ts` - Business submissions
- `functions/api/admin/business-submissions.ts` - Admin approval/rejection actions  
- `functions/api/admin/contact-messages.ts` - Contact message resolution

## Notification Types

### 1. Contact Form Submissions
**Endpoint**: `/api/contact`
**Trigger**: When a user submits a contact form
**Icon**: 📧 (`:mailbox:`)
**Color**: Green (`#36a64f`)

**Included Information**:
- Name and email
- Phone number (if provided)
- Subject and message
- Inquiry type (general, business listing, etc.)
- Business name (if applicable)
- Location (category, city, state)
- Priority level
- Preferred contact method
- Submission ID and timestamp

### 2. Business Submissions
**Endpoint**: `/api/submit-business`
**Trigger**: When a business owner submits a registration form
**Icon**: 🏢 (`:office:`)
**Color**: Orange (`#ff9900`)

**Included Information**:
- Business name and owner
- Contact details (email, phone)
- Business category and location
- Address and website
- Services offered
- Business description
- Submitter information
- Submission ID and timestamp

### 3. Admin Actions - Business Approval/Rejection
**Endpoint**: `/api/admin/business-submissions`
**Trigger**: When an admin approves or rejects a business submission
**Icon**: ✅ (`:white_check_mark:`) for approval, ❌ (`:x:`) for rejection
**Color**: Green (`#36a64f`) for approval, Red (`#ff4444`) for rejection

**Included Information**:
- Business name and category
- Location and contact email
- New status (APPROVED/REJECTED)
- Admin notes (if provided)
- Submission ID and timestamp

### 4. Contact Message Resolution
**Endpoint**: `/api/admin/contact-messages`
**Trigger**: When an admin resolves a contact message
**Icon**: ✅ (`:white_check_mark:`)
**Color**: Green (`#36a64f`)

**Included Information**:
- Contact person name and email
- Subject and message content
- Category and location
- Resolved by (admin name)
- Admin notes (if provided)
- Message ID and timestamp

## Implementation Details

### Slack Utility Functions
Location: `functions/utils/slack.ts`

The utility includes:
- `sendSlackNotification()` - Main function for sending notifications
- `SlackNotification` interface - Type definitions
- `buildSlackPayload()` - Formats messages for Slack
- `buildContactFields()` - Formats contact form data
- `buildBusinessFields()` - Formats business submission data

### Error Handling
- Slack notifications are sent asynchronously and don't block the main submission flow
- Failed Slack notifications are logged but don't cause the original request to fail
- All notifications include error handling with try/catch blocks

### Message Formatting
- Rich attachments with color coding
- Structured field layouts for easy scanning
- Truncated long messages (300 character limit)
- Clickable links to admin dashboard
- Timestamp and submission ID footers

## Monitoring and Maintenance

### Webhook Health
- Monitor the Slack webhook URL for availability
- Check Slack channel for notification delivery
- Review server logs for failed notification attempts

### Notification Volume
- Track notification frequency to avoid spam
- Consider implementing rate limiting if needed
- Monitor Slack workspace notification settings

### Updates and Changes
- Update webhook URL in all endpoint files if changed
- Test notifications after any code changes
- Ensure proper error handling in all implementations

## Testing

To test the Slack notifications:

1. **Contact Form**: Submit a contact form through the website
2. **Business Submission**: Submit a business registration form
3. **Admin Actions**: Approve or reject a business submission through admin dashboard
4. **Message Resolution**: Resolve a contact message through admin dashboard

Each action should trigger a corresponding Slack notification with properly formatted content.

## Security Considerations

- The webhook URL is hardcoded in the source code
- Consider moving webhook URL to environment variables for better security
- Monitor webhook usage for unauthorized access
- Regularly rotate webhook URLs if compromised

## Future Enhancements

Potential improvements:
- Add notification for user registrations
- Include engagement metrics in notifications
- Add notification preferences/filtering
- Implement notification templates
- Add support for multiple Slack channels
- Include direct action buttons in notifications
