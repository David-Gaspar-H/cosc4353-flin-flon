import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";

const Signature = ({ onSave }) => {
	const signatureCanvasRef = useRef(null);

	const clearSignature = () => {
		signatureCanvasRef.current.clear();
	};

	const saveSignature = () => {
		if (signatureCanvasRef.current.isEmpty()) {
			alert("Please provide a signature before saving.");
			return;
		}

		// Convert signature to base 64
		const signatureData = signatureCanvasRef.current
			.getCanvas()
			.toDataURL("image/png");

		// Send signature data back to parent component
		if (onSave) {
			onSave(signatureData);
		}
	};

	return (
		<Paper
			sx={{
				width: "580px",
				padding: 2,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "auto",
			}}
		>
			<SignatureCanvas
				ref={signatureCanvasRef}
				penColor="black"
				canvasProps={{
					width: 500,
					height: 200,
					className: "signature-canvas",
					style: {
						border: "2px solid black",
						marginBottom: 20,
					},
				}}
			/>
			<Stack spacing={2} direction="row">
				<Button
					variant="contained"
					color="primary"
					onClick={clearSignature}
				>
					Clear Signature
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={saveSignature}
				>
					Save Signature
				</Button>
			</Stack>
		</Paper>
	);
};

export default Signature;
