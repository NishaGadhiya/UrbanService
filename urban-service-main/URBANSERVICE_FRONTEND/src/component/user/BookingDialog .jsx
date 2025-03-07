import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Autocomplete,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const BookingDialog = ({ selectedService, setSelectedService, handleBooking }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [date, setDate] = useState("");
    const [address, setAddress] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const steps = ["Select Date & Address", "Accept Terms & Conditions", "Confirm Booking"];

    // Keep this function as is
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await response.json();

                    if (data && data.address) {
                        const formattedAddress = `${data?.class}, ${data?.display_name}}`;
                        setAddress(formattedAddress.trim());
                    } else {
                        alert("Unable to fetch address.");
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                    alert("Error fetching location.");
                }

                setLoadingLocation(false);
            },
            (error) => {
                console.error("Geolocation Error:", error);
                alert("Failed to get location. Please enter manually.");
                setLoadingLocation(false);
            }
        );
    };

    const handleNext = () => {
        if (activeStep === 0 && (!date || !address.trim())) return;
        if (activeStep === 1 && !agreed) return;
        setActiveStep((prev) => prev + 1);
    };

    const resetBookingState = () => {
        setDate("");
        setAddress("");
        setAgreed(false);
        setActiveStep(0);
        setSelectedService(null);
    };

    return (
        <Dialog
            open={!!selectedService}
            onClose={resetBookingState} 
            sx={{ "& .MuiDialog-paper": { width: "600px", height: "auto", padding: "16px" } }}
        >
            <DialogTitle className="bg-gradient-dark" sx={{ color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Book {selectedService?.name}
                <IconButton onClick={resetBookingState} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 4, mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === 0 && (
                    <>
                        <TextField
                            label="Select Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{ mt: 2 }}
                            inputProps={{ min: new Date().toISOString().split("T")[0] }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <Autocomplete
                            freeSolo
                            options={[]} // No default addresses
                            getOptionLabel={(option) => option}
                            value={address}
                            onInputChange={(event, newValue) => setAddress(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Enter Address"
                                    fullWidth
                                    required
                                    sx={{ mt: 2 }}
                                    helperText="Enter a valid address or use your current location."
                                />
                            )}
                        />

                        <Button
                            variant="outlined"
                            sx={{ mt: 2, width: "100%" }}
                            onClick={getCurrentLocation}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? <CircularProgress size={20} sx={{ mr: 1 }} /> : "Use Current Location"}
                        </Button>
                    </>
                )}

                {activeStep === 1 && (
                    <div style={{ padding: "10px 0" }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Urban Services Booking Policy:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            ✅ Service providers are verified professionals, but Urban Services is not liable for service quality. <br />
                            ✅ Cancellations within <strong>24 hours</strong> may incur a cancellation fee. <br />
                            ✅ Payments are securely processed, and refunds (if applicable) take <strong>5-7 business days</strong>. <br />
                        </Typography>

                        <FormControlLabel
                            control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />}
                            label="I agree to the Terms & Conditions."
                            sx={{ mt: 2 }}
                        />
                    </div>
                )}

                {activeStep === 2 && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            ✅ Ready to confirm your booking?
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#b0b0b0", mt: 1 }}>
                            Please review all details before proceeding.
                        </Typography>
                    </div>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }} className="bg-gradient-dark">
                {activeStep > 0 && <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>}
                {activeStep < 2 ? (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        disabled={!date || !address.trim()}
                        sx={{
                            bgcolor: (!date || !address.trim()) ? "#fff" : "#6200ea",
                            color: (!date || !address.trim()) ? "black" : "white"
                        }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            handleBooking(date, address);
                            resetBookingState();
                        }}
                        variant="contained"
                    >
                        Confirm Booking
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
