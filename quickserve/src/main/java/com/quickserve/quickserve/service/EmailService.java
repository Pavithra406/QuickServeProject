package com.quickserve.quickserve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Gets sender email from application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBookingStatusEmail(
            String toEmail,
            String serviceType,
            String status
    ) {

        if (toEmail == null || toEmail.isEmpty()) {
            System.err.println("Email not sent: Customer email is empty.");
            return;
        }

        try {

            System.out.println("Preparing to send email to: " + toEmail);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);

            String subject;
            String text;

            switch (status.toUpperCase()) {

                case "COMPLETED":
                    subject = "🎉 Your Service is Completed - QuickServe";
                    text = buildCompletedMessage(serviceType);
                    break;

                case "APPROVED":
                    subject = "✅ Booking Approved - QuickServe";
                    text = buildApprovedMessage(serviceType);
                    break;

                case "REJECTED":
                    subject = "❌ Booking Rejected - QuickServe";
                    text = buildRejectedMessage(serviceType);
                    break;

                default:
                    subject = "QuickServe Booking Status Update";
                    text = buildGenericMessage(serviceType, status);
            }

            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

            System.out.println("✅ Email sent successfully to: " + toEmail);

        } catch (MailException e) {
            System.err.println("❌ Error sending email to " + toEmail);
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ Unexpected error while sending email:");
            e.printStackTrace();
        }
    }

    // ================= MESSAGE BUILDERS =================

    private String buildCompletedMessage(String serviceType) {
        return "Hello,\n\n" +
                "Great news! 🎉\n\n" +
                "Your booking for " + serviceType +
                " has been successfully completed.\n\n" +
                "We hope you are satisfied with the service.\n" +
                "You can now log in to your dashboard and rate the service.\n\n" +
                "Thank you for choosing QuickServe!\n\n" +
                "Best regards,\n" +
                "QuickServe Team";
    }

    private String buildApprovedMessage(String serviceType) {
        return "Hello,\n\n" +
                "Good news! ✅\n\n" +
                "Your booking for " + serviceType +
                " has been APPROVED by the provider.\n\n" +
                "The provider will contact you soon.\n\n" +
                "Thank you for using QuickServe.\n\n" +
                "Best regards,\n" +
                "QuickServe Team";
    }

    private String buildRejectedMessage(String serviceType) {
        return "Hello,\n\n" +
                "We’re sorry to inform you that your booking for " +
                serviceType + " has been REJECTED.\n\n" +
                "You may try booking another provider.\n\n" +
                "Thank you for using QuickServe.\n\n" +
                "Best regards,\n" +
                "QuickServe Team";
    }

    private String buildGenericMessage(String serviceType, String status) {
        return "Hello,\n\n" +
                "Your booking for " + serviceType +
                " is now: " + status + ".\n\n" +
                "Thank you for using QuickServe.\n\n" +
                "Best regards,\n" +
                "QuickServe Team";
    }
}