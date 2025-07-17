/**
 * Slack notification utilities
 * Handles sending notifications to Slack webhook for form submissions
 */

export interface SlackNotification {
  type: 'contact' | 'business';
  data: ContactNotificationData | BusinessNotificationData;
  submissionId: string;
  timestamp: string;
}

export interface ContactNotificationData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType?: string;
  businessName?: string;
  category?: string;
  city?: string;
  state?: string;
  urgency?: string;
  preferredContact?: string;
}

export interface BusinessNotificationData {
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  state?: string;
  zipCode?: string;
  category: string;
  website?: string;
  description?: string;
  services?: string[];
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
}

/**
 * Send notification to Slack webhook
 */
export async function sendSlackNotification(
  webhookUrl: string,
  notification: SlackNotification
): Promise<void> {
  try {
    const payload = buildSlackPayload(notification);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    // Don't throw error to prevent blocking the main submission flow
  }
}

/**
 * Build Slack message payload based on notification type
 */
function buildSlackPayload(notification: SlackNotification): any {
  const basePayload = {
    username: 'Near Me Submissions',
    icon_emoji: ':mailbox:',
    attachments: [],
  };

  if (notification.type === 'contact') {
    return {
      ...basePayload,
      text: ':email: New Contact Form Submission',
      attachments: [
        {
          color: '#36a64f',
          title: 'Contact Form Submission',
          title_link: `https://near-me.us/admin/dashboard`,
          fields: buildContactFields(notification.data as ContactNotificationData),
          footer: `Submission ID: ${notification.submissionId}`,
          ts: Math.floor(new Date(notification.timestamp).getTime() / 1000),
        },
      ],
    };
  } else if (notification.type === 'business') {
    return {
      ...basePayload,
      text: ':office: New Business Submission',
      attachments: [
        {
          color: '#ff9900',
          title: 'Business Submission',
          title_link: `https://near-me.us/admin/dashboard`,
          fields: buildBusinessFields(notification.data as BusinessNotificationData),
          footer: `Submission ID: ${notification.submissionId}`,
          ts: Math.floor(new Date(notification.timestamp).getTime() / 1000),
        },
      ],
    };
  }

  return basePayload;
}

/**
 * Build Slack fields for contact form data
 */
function buildContactFields(data: ContactNotificationData): any[] {
  const fields = [
    {
      title: 'Name',
      value: data.name,
      short: true,
    },
    {
      title: 'Email',
      value: data.email,
      short: true,
    },
  ];

  if (data.phone) {
    fields.push({
      title: 'Phone',
      value: data.phone,
      short: true,
    });
  }

  if (data.inquiryType) {
    fields.push({
      title: 'Inquiry Type',
      value: data.inquiryType,
      short: true,
    });
  }

  if (data.businessName) {
    fields.push({
      title: 'Business Name',
      value: data.businessName,
      short: true,
    });
  }

  if (data.category && data.city) {
    fields.push({
      title: 'Location',
      value: `${data.category} in ${data.city}${data.state ? `, ${data.state}` : ''}`,
      short: true,
    });
  }

  if (data.urgency) {
    fields.push({
      title: 'Priority',
      value: data.urgency,
      short: true,
    });
  }

  if (data.preferredContact) {
    fields.push({
      title: 'Preferred Contact',
      value: data.preferredContact,
      short: true,
    });
  }

  fields.push({
    title: 'Subject',
    value: data.subject,
    short: false,
  });

  fields.push({
    title: 'Message',
    value: data.message.length > 300 ? `${data.message.substring(0, 300)}...` : data.message,
    short: false,
  });

  return fields;
}

/**
 * Build Slack fields for business submission data
 */
function buildBusinessFields(data: BusinessNotificationData): any[] {
  const fields = [
    {
      title: 'Business Name',
      value: data.businessName,
      short: true,
    },
    {
      title: 'Owner',
      value: data.ownerName,
      short: true,
    },
    {
      title: 'Email',
      value: data.email,
      short: true,
    },
    {
      title: 'Category',
      value: data.category,
      short: true,
    },
  ];

  if (data.phone) {
    fields.push({
      title: 'Phone',
      value: data.phone,
      short: true,
    });
  }

  if (data.city) {
    fields.push({
      title: 'Location',
      value: `${data.city}${data.state ? `, ${data.state}` : ''}${data.zipCode ? ` ${data.zipCode}` : ''}`,
      short: true,
    });
  }

  if (data.address) {
    fields.push({
      title: 'Address',
      value: data.address,
      short: false,
    });
  }

  if (data.website) {
    fields.push({
      title: 'Website',
      value: data.website,
      short: true,
    });
  }

  if (data.services && data.services.length > 0) {
    fields.push({
      title: 'Services',
      value: data.services.join(', '),
      short: false,
    });
  }

  if (data.description) {
    fields.push({
      title: 'Description',
      value: data.description.length > 300 ? `${data.description.substring(0, 300)}...` : data.description,
      short: false,
    });
  }

  if (data.submitterName || data.submitterEmail) {
    fields.push({
      title: 'Submitted By',
      value: `${data.submitterName || 'Unknown'} (${data.submitterEmail || 'No email'})`,
      short: false,
    });
  }

  return fields;
}
