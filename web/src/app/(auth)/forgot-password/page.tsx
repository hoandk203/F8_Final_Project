'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button, TextField, Card, CardContent, Typography, Box, Alert, AlertTitle } from '@mui/material';
import VerifyEmail from '@/components/VerifyEmail';
import { sendVerificationEmail } from '@/services/authService';
import LoadingOverlay from '@/components/LoadingOverlay';
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await sendVerificationEmail({email, changePassword: true})
            localStorage.setItem("userData", JSON.stringify({email}))
            setStep(2)
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    if(step === 1){
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                {isSubmitting && <LoadingOverlay/>}
                <Card sx={{ maxWidth: 450, width: '100%', p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="h1" align="center" gutterBottom>
                            Forgot Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                            Enter your email to receive new password
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                disabled={isSubmitting}
                                sx={{ mt: 2, mb: 2, backgroundColor: '#303030' }}
                            >
                                {isSubmitting ? 'Sending...' : 'Reset password'}
                            </Button>
                        </form>
                        
                        
                        <Box textAlign="center" mt={2}>
                            <Link href="/login" style={{ color: 'black', textDecoration: 'none' }}>
                                Back to login page
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        );
    }
    if(step === 2){
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <VerifyEmail email={email} changePassword={true}/>
            </div>
        )
    }
}

export default ForgotPasswordPage;