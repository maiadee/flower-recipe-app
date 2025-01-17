export default function errorHandler(e, req, res, next) {
  console.log(e, e.name);
  if (e.name === "CastError") {
    res.status(400).send({
      message: "The ID you provided was not valid. please provide a validID",
    });
  } else if (e.name === "SyntaxError") {
    res.status(422).send({ message: "Invalid JSON in your request body" });
  } else if (e.name === "ValidationError") {
    const customError = {};
    for (const key in e.errors) {
      customError[key] = e.errors[key].errors;
    }
    res.status(422).json({
      message: "The data you provided was not valid. please provide valid data",
    });
  } else {
    res.status(500).send({
      message: "Something went wrong. Please check your request and try again!",
    });
  }
}
