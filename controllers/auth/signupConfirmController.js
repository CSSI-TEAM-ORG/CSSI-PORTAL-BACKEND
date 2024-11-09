import jsonwebtoken from "jsonwebtoken";
import supabase from '../../configs/supabaseClient.js';
import dotenv from "dotenv"
dotenv.config();

const signupConfirmController = async (req, res) => {
    const { token_hash, type } = req.query;

    if (!token_hash || type !== 'signup') {
        return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    const { data: user, error: verifyerror } = await supabase.auth.verifyOtp
        ({ token_hash, type: 'email' });

    if (verifyerror) {
        return res.status(400).json({ message: 'Verification failed: ' + verifyerror.message });
    }

    const { data: updated_user, error: updateError } = await supabase
        .from('NGO')
        .update({ is_verified: true })
        .eq('email', user.user.email)
        .select();
    if (updateError) {
        return res.status(500).json({ message: 'Failed to update user verification status.' });
    }

    const Token = jsonwebtoken.sign(
        { id: updated_user[0].id, email: updated_user[0].email, role: 'ngo' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('authToken', Token, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'Lax',
    });

    res.redirect('http://localhost:3000/ngo/dashboard');
}

export { signupConfirmController }