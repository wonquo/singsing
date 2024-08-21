// StyledTextField.js
import { styled } from "@mui/system";
import { TextField } from "@mui/material";

const StyledTextField = styled(TextField, {
  name: "StyledTextField",
})({
  width: "150px",
  "& .MuiInputBase-root": {
    height: "40px",
  },
});

export default StyledTextField;
