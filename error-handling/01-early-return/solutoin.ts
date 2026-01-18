export const validateUserInpnt = ({
  email,
  age,
}: {
  email: string;
  age: number;
}) => {
  switch (true) {
    case !email:
      return { isValid: false, message: "Email is required" };

    case !email.includes("@"):
      return { isValid: false, message: "Email must contain @" };

    case !age || age <= 0:
      return {
        isValid: false,
        message: "Age must be greater than 0",
      };
    default:
      return {
        isValid: true,
        message: "User input is valid",
      };
  }
};
