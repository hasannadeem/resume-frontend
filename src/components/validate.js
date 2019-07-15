const validate = values => {
  let errors = {};

  if (values.position.trim() === "") {
    errors.position = "Position is Required";
  }
  if (values.description.trim() === "") {
    errors.description = "Description is Required";
  }
  if (values.year.trim() === "") {
    errors.year = "Year is Required";
  }
  if (values.year.trim() !== "" && !Number.isInteger(parseInt(values.year))) {
    errors.year = "Enter Valid Year";
  } else if (
    parseInt(values.year) < 1950 ||
    parseInt(values.year) > new Date().getFullYear()
  ) {
    errors.year = "Year out of Range";
  }

  return errors;
};

export default validate;
