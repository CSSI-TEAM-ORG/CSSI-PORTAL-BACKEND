import Supabase from '../../configs/supabaseClient.js';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const contactAdminController = async (req, res) => {
    const { name, rollno, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
        },
        secure: false,
    });

    const { data: admins, error } = await Supabase
        .from('admin')
        .select('email');

    if (error) {
        return res.status(500).json({ message: 'Failed to fetch admin emails', error });
    }

    const adminEmails = admins.map(admin => admin.email).join(',');

    const mailData1 = {
        from: `CSSI <${process.env.EMAIL_ID}>`,
        to: adminEmails,  
        subject: `New Query from ${name}`,
        html: `
            <h3>New Query Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Roll No:</strong> ${rollno}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p>Please respond to this query at your earliest convenience.</p>
        `,
    };

    const mailData2 = {
        from: `CSSI <${process.env.EMAIL_ID}>`,
        to: email,  
        subject: 'Query Submission Confirmation',
        html: `
            <h3>Thank You for Contacting Us!</h3>
            <p>Dear ${name},</p>
            <p>We have received your query and our team will get back to you shortly.</p>
            <p><strong>Your Query Details:</strong></p>
            <p><strong>Roll No:</strong> ${rollno}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p>If you have any further questions, feel free to reach out.</p>
            <p>Best Regards,<br>CSSI Support Team</p>
        `,
    };

    transporter.sendMail(mailData1, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error sending email to admins', err });
        }
    });

    transporter.sendMail(mailData2, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error sending confirmation email to user', err });
        }
    });

    return res.status(200).json({ message: "Email sent to all admins and user successfully!" });
}

export { contactAdminController };
