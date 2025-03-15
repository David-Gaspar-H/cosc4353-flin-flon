import React, {useRef} from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {Button, Paper} from "@mui/material";
import Stack from "@mui/material/Stack";

const Signature = () => {
    const signatureCanvasRef = useRef(null);

    const clearSignature = () => {
        signatureCanvasRef.current.clear();
    };

    const saveSignature = async () => {
        const canvas = signatureCanvasRef.current.getCanvas();

        canvas.toBlob(async (blob) => {
            const timestamp = new Date().toISOString();
            const filename = `signature_${timestamp}.png`;

            const formData = new FormData();
            formData.append('signature', blob, filename);

            try {
                const response = await fetch('https://localhost:8000/signature', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to save the signature');
                }

                const data = await response.json();
                const savedUrl = data.path;

                console.log('Signature saved at:', savedUrl);
                // onSave(id, savedUrl);

            } catch (error) {
                console.error('Error saving signature:', error);
            }
        }, 'image/png');
    };


    return (
        <Paper sx={{
            width: "580px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
        }}>
            <SignatureCanvas
                ref={signatureCanvasRef}
                penColor="black"
                canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas',
                    style: {
                        border: '2px solid black',
                        marginBottom: 20,
                    },
                }}
            />
            <Stack spacing={2} direction="row">
                <Button variant="contained" color="primary" onClick={clearSignature}>
                    Clear Signature
                </Button>
                <Button variant="contained" color="secondary" onClick={saveSignature}>
                    Save Signature
                </Button>
            </Stack>
        </Paper>
    );
};

export default Signature;
