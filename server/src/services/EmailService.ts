import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const formatDate = (time: Date) =>
    time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    + " at " + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

const getText = (subject: string, sender: string, originalTime: Date, newTime?: Date) => {
    if (subject == "New appointment")
        return "The customer " + sender + " just scheduled a new appointment."
            + "\nAppointment time: " + formatDate(originalTime);
    else if (subject == "Cancel appointment")
        return "The user " + sender + " just cancel appointment."
            + "\nAppointment time: " + formatDate(originalTime);
    else 
        return "The user " + sender + " just rescheduled appointment."
            + "\nOld Appointment time: " + formatDate(originalTime)
            + "\nNew Appointment time: " + formatDate(newTime!);
}

const sendEmail = async (emailDetails: EmailDetails): Promise<string> => {
    const text = getText(String(emailDetails?.subject), String(emailDetails?.initiator), emailDetails?.originalTime!, emailDetails?.newTime);
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: emailDetails?.sendEmailTo,
        subject: emailDetails?.subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw error;
    }
};

export default sendEmail;