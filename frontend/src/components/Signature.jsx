import React, {useRef, useState} from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {Button, Paper, Typography, Alert} from "@mui/material";
import Stack from "@mui/material/Stack";

const Signature = ({id, onSave}) => {
    const signatureCanvasRef = useRef(null);
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'

    const clearSignature = () => {
        signatureCanvasRef.current.clear();
        setIsSignatureEmpty(true);
        setSaveStatus(null);
    };

    const handleBeginStroke = () => {
        setIsSignatureEmpty(false);
    };

    const saveSignature = async () => {
        if (isSignatureEmpty) {
            setSaveStatus('empty');
            return;
        }

        try {
            const signatureData = signatureCanvasRef.current.toDataURL('image/png');

            if (onSave && typeof onSave === 'function') {
                onSave(signatureData);
                setSaveStatus('success');
            } else {
                // If using without parent integration, you could implement server upload here
                const blob = await (await fetch(signatureData)).blob();
                const timestamp = new Date().toISOString();
                const filename = `signature_${id || 'unknown'}_${timestamp}.png`;

                const formData = new FormData();
                formData.append('signature', blob, filename);
                setSaveStatus('success');
            }
        } catch (error) {
            setSaveStatus('error');
        }
    };

    return (
        <Paper sx={{
            width: "100%",
            maxWidth: "580px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
        }}>
            {id && (
                <Typography variant="subtitle1" gutterBottom>
                    Signature for: {id}
                </Typography>
            )}

            <SignatureCanvas
                ref={signatureCanvasRef}
                penColor="black"
                onBegin={handleBeginStroke}
                canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas',
                    style: {
                        border: '2px solid black',
                        marginBottom: 20,
                        width: '100%',
                    },
                }}
            />

            {saveStatus === 'empty' && (
                <Alert severity="warning" sx={{mb: 2, width: '100%'}}>
                    Please sign before saving.
                </Alert>
            )}

            {saveStatus === 'success' && (
                <Alert severity="success" sx={{mb: 2, width: '100%'}}>
                    Signature saved successfully!
                </Alert>
            )}

            {saveStatus === 'error' && (
                <Alert severity="error" sx={{mb: 2, width: '100%'}}>
                    Error saving signature. Please try again.
                </Alert>
            )}

            <Stack spacing={2} direction="row">
                <Button
                    variant="contained"
                    color="error"
                    onClick={clearSignature}
                >
                    Clear Signature
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveSignature}
                    disabled={isSignatureEmpty}
                >
                    Save Signature
                </Button>
            </Stack>
        </Paper>
    );
};

export default Signature;