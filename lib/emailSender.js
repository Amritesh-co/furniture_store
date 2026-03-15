import nodemailer from 'nodemailer'
import { getBusinessInfo } from '@/lib/settingsService'

let transporter
let transporterPromise

const createTransporter = () => {
  const allowInsecureTls = process.env.ALLOW_INSECURE_SMTP_TLS === 'true'
  const port = parseInt(process.env.EMAIL_PORT || '587', 10)

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: !allowInsecureTls,
    },
  })
}

export async function getTransporter() {
  if (transporter) {
    return transporter
  }

  if (!transporterPromise) {
    transporterPromise = (async () => {
      const smtpTransporter = createTransporter()
      await smtpTransporter.verify()
      console.log('SMTP connection verified successfully')
      transporter = smtpTransporter
      return smtpTransporter
    })().catch((error) => {
      transporterPromise = null
      throw error
    })
  }

  return transporterPromise
}

export const sendInvoiceEmail = async ({ customerEmail, customerName, orderId, invoiceId, totalAmount, pdfBuffer }) => {
  try {
    const businessInfo = await getBusinessInfo()
    const businessAddress = `${businessInfo.addressLine1}, ${businessInfo.addressLine2}`
    const transporter = await getTransporter()
    const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)
    const senderEmail = process.env.EMAIL_USER || businessInfo.email

    const mailOptions = {
      from: `"Woodcraft Furniture" <${senderEmail}>`,
      to: customerEmail,
      subject: `Your Woodcraft Furniture Invoice - Order #${orderId}`,
      text: `Dear ${customerName},

Thank you for choosing Woodcraft Furniture.

Please find attached the invoice for your recent purchase.

Order ID: ${orderId}
Invoice Number: ${invoiceId}
Total Amount: ${formattedAmount}

If you have any questions regarding your order or warranty, feel free to contact us.

Email: ${businessInfo.email}
Phone / WhatsApp: ${businessInfo.phone}
Instagram: ${businessInfo.instagramUrl}

Thank you for shopping with us.

Warm regards,
${businessInfo.displayName}
${businessAddress}`,
      attachments: [
        {
          filename: `invoice_${orderId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Invoice email sent successfully to ${customerEmail}. Message ID: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending invoice email:', error)
    return { success: false, error: error.message }
  }
}

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const businessInfo = await getBusinessInfo()
  const recipientEmail = process.env.EMAIL_USER || businessInfo.email

  try {
    const transporter = await getTransporter()
    const mailOptions = {
      from: `"Woodcraft Contact Form" <${recipientEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      text: `You have received a new message from the contact form on Woodcraft Furniture.
      
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
To reply, simply reply to this email, as the Reply-To address is set to the user's email.
`,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: error.message }
  }
}

export const sendCustomInquiryEmail = async ({ name, email, phone, furnitureType, budget, requirements }) => {
  const businessInfo = await getBusinessInfo()
  const recipientEmail = process.env.EMAIL_USER || businessInfo.email

  try {
    const transporter = await getTransporter()
    const formattedBudget = budget ? `₹${parseInt(budget).toLocaleString('en-IN')}` : 'Not Specified'

    const mailOptions = {
      from: `"Woodcraft Custom Inquiry" <${recipientEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Custom Furniture Inquiry: ${furnitureType}`,
      text: `You have received a new custom furniture inquiry on Woodcraft.
      
--- Customer Details ---
Name: ${name}
Email: ${email}
Phone: ${phone}

--- Inquiry Details ---
Furniture Type: ${furnitureType}
Budget: ${formattedBudget}

Requirements / Description:
${requirements}

---
To reply directly via email, simply reply to this message (Reply-To is set to ${email}).
`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Custom inquiry email sent successfully. Message ID: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending custom inquiry email:', error)
    return { success: false, error: error.message }
  }
}

