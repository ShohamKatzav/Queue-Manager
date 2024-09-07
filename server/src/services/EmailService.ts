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

const getText = (subject: string, initiator: string, originalTime: Date, newTime?: Date) => {
    const formattedOriginalTime = formatDate(originalTime);
    const formattedNewTime = newTime ? formatDate(newTime) : '';

    let emailBody = '';

    if (subject.startsWith("New appointment")) {
        emailBody = `
            <p style="font-family: Arial, sans-serif; font-size: 16px;">
                Hello,<br><br>
                The customer ${initiator} has scheduled a new appointment.<br><br>
                Original Appointment Time: ${formattedOriginalTime}<br><br>
                Best regards,
            </p>
            `;
    }
    if (subject.startsWith("Appointment canceled")) {
        emailBody = `
            <p style="font-family: Arial, sans-serif; font-size: 16px;">
                Hello,<br><br>
                An appointment has been canceled by ${initiator}.<br><br>
                Original Appointment Time: ${formattedOriginalTime}<br><br>
                We apologize for any inconvenience.
            </p>
            `;
    } else {
        emailBody = `
            <p style="font-family: Arial, sans-serif; font-size: 16px;">
                Hello,<br><br>
                An appointment has been rescheduled by ${initiator}.<br><br>
                Original Appointment Time: ${formattedOriginalTime}<br>
                New Appointment Time: ${formattedNewTime}<br><br>
                Best regards,
            </p>
            `;
    }
    return emailBody;
};


const sendEmail = async (emailDetails: EmailDetails): Promise<string> => {

    const htmlContent = getText(emailDetails?.subject!, emailDetails?.initiator!, emailDetails?.originalTime!, emailDetails?.newTime);
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: emailDetails?.sendEmailTo,
        subject: emailDetails?.subject,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw error;
    }
};

export default sendEmail;