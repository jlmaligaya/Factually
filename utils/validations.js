export const validateRegister = async (firstName, lastName, email, username, password, confirmPass ) => {
    const errors = {};
  
    // validate firstName
    if (!firstName) {
      errors.firstName = "Please enter your first name";
    }
  
    // validate lastName
    if (!lastName) {
      errors.lastName = "Please enter your last name";
    }
  
    // validate email
    if (!email) {
      errors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    } else if (await prisma.user.findUnique({ where: { email } })
    ) {
        errors.email = "Email already taken"
    }
  
    // validate password
    if (!password) {
      errors.password = "Please enter a password";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    // validate confirmPassword
    if (!confirmPass) {
      errors.confirmPass = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPass = "Passwords do not match";
    }
  
    // validate username
    if (!username) {
      errors.username = "Please enter a username";
    } else if (await prisma.user.findUnique({ where: { username } })) {
        errors.username = "Username already taken."
    }
  
    return errors;
  };
  