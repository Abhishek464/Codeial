const nodemailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    //console.log('inside newComment mailer',comment);
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comments.ejs');

    nodemailer.transporter.sendMail({
        from:'gabhishek464@gmail.com',
        to:'gabhishek464@gmail.com',
        subject:"New comment Published",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;

    });
}