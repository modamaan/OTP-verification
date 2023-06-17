import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Formik, useFormik } from "formik";
const validate = (values) => {
  const errors = {};

  if (values.otp.some((data) => data === "")) {
    errors.otp = "This field is required";
  }
  return errors;
};

function App() {
  //
  const [consoleOutput, setConsoleOutput] = useState("");
  //
  const formik = useFormik({
    initialValues: {
      otp: Array.from({ length: 6 }).fill(""),
    },
    validate,
    onSubmit: (values) => {
      const output = values.otp.join("");
      setConsoleOutput(output);
    },
  });
  const inputRef = useRef({});
  useEffect(() => {
    inputRef.current[0].focus();

    inputRef.current[0].addEventListener("paste", pasteText);

    return () => inputRef.current[0].removeEventListener("paste", pasteText);
  }, []);

  const pasteText = (event) => {
    const pastedText = event.clipboardData.getData("text");
    const fieldValues = {};
    formik.values.otp.forEach((keys, index) => {
      fieldValues[keys] = pastedText[index];
    });
    formik(fieldValues);
    inputRef.current[5].focus();
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    if (/[a-z]/gi.test(value)) return;

    const currentOTP = [...formik.values.otp];
    currentOTP[index] = value.slice(-1);

    formik.setValues((prev) => ({
      ...prev,
      otp: currentOTP,
    }));

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleBackSpace = (event, index) => {
    if (event.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        value={value}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        key={index}
        name={index}
        className="w-12 h-12 sm:w-16 sm:h-12 rounded-md mr-3 text-center text-xl"
        onChange={(event) => handleChange(event, index)}
        onKeyUp={(event) => handleBackSpace(event, index)}
      />
    ));
  };
  return (
    <div className="container mx-auto">
      <form action="">
        <h3 className="text-4xl lg:text-5xl font-bold text-gradient mb-10 ">
          Please Fill the OTP
        </h3>
        <Formik>
          <div className="flex items-center justify-center">{renderInput()}</div>
        </Formik>
        {formik.errors.otp && (
          <p className="mt-3 text-sm sm:text-base text-red-400">Please fill the fields</p>
        )}
        <button
          type="buttton"
          className="mt-4 w-24 sm:w-32 border border-solid text-center bg-[#3b3b3b] rounded hover:bg-[#252525] hover:border-[#3b3b3b]"
          onClick={formik.handleSubmit}
        >
          Submit
        </button>
        <div className="text-gray-400 font-serif text-4xl mt-4 truncate font-bold hover:text-red-800">
          {consoleOutput}
        </div>
      </form>
    </div>
  );
}


export default App;
